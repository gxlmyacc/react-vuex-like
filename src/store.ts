import { observable, extendObservable, when, set, remove, action } from 'mobx';

function defComputed(obj: any, key: string, get?: () => any, set?: (v: any) => void) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get,
    set: set || function (v) { throw new Error(`props: ${key} is readonly!`); }
  });
}

export type MutationListener = (event: { type: string, payload: any }, state: Partial<any>) => void;
export type ActionListener = (event: { type: string, payload: any }, state: Partial<any>) => void;


export interface StoreBase {
  state: Partial<any>,
  getters: Partial<any>,
  // modules?: {
  //   [moduleName: string]: any;
  // }
}

export interface StoreModule<
  S extends Partial<any> = Partial<any>,
  G extends Partial<any> = Partial<any>,
  P extends StoreBase = { state: Partial<any>, getters: Partial<any> },
  M extends Partial<StoreModule> = { [key: string]: StoreModule }
> {
  namespaced: boolean;
  strict?: boolean;
  plugins?: StorePlugin<S, G, P, M>[];
  extends?: Store;

  state: Partial<S>;

  getters?: Partial<G>;

  mutations?: Partial<any>;

  actions?: Partial<any>;

  modules?: {
    [K in keyof M]?: M;
  },

  install?(ReactVueLike: any, options: { App: any }): void;
}

export type StorePlugin<
  S extends Partial<any> = Partial<any>,
  G extends Partial<any> = Partial<any>,
  P extends StoreBase = { state: Partial<any>, getters: Partial<any> },
  M extends Partial<StoreModule> = { [key: string]: StoreModule }
> = (store: Store<S, G, P, M>) => void;

class Store<
  S extends Partial<any> = Partial<any>,
  G extends Partial<any> = Partial<any>,
  P extends StoreBase = { state: Partial<any>, getters: Partial<any> },
  M extends Partial<StoreModule> = { [key: string]: StoreModule }
> implements StoreBase {

  state: P['state'] & S & {
    [K in keyof M]: {
      [K in keyof M['state']]?: M['state'][K];
    }
  };

  getters: P['getters'] & G & {
    [K in keyof M]: {
      [K in keyof M['getters']]?: M['getters'][K];
    }
  };

  readonly moduleName: string;

  readonly namespaced: boolean;

  readonly strict: boolean;

  protected root: any;

  protected parent?: any;

  protected mutationListeners: MutationListener[];

  protected actionListeners: ActionListener[];

  protected mutations: {
    [event: string]: (
      state: P['state'] & S & {
        [K in keyof M]: {
          [K in keyof M['state']]?: M['state'][K];
        }
      },
      payload: any,
      parent?: Store,
      root?: Store
    ) => any;
  };

  protected actions: {
    [event: string]: ({ state, getters, commit }: {
      state: P['state'] & S & {
        [K in keyof M]: {
          [K in keyof M['state']]?: M['state'][K];
        }
      },
      getters: P['getters'] & G & {
        [K in keyof M]: {
          [K in keyof M['getters']]?: M['getters'][K];
        }
      };
      commit: (event: string, payload: any) => any;
    }) => any;
  };

  protected modules: {
    [moduleName: string]: Store
  }

  protected plugins: StorePlugin<S, G, P, M>[];

  protected extends?: Store;

  protected _commiting: boolean;

  protected _module: StoreModule<S, G, P, M>;

  protected _state: S;

  protected _getters: G;

  constructor(module: StoreModule<S, G, P, M>, parent?: Store, root?: Store, moduleName?: string) {
    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.actionListeners = [];
    this.moduleName = moduleName || '';
    this.namespaced = module.namespaced || false;
    this.strict = Boolean(module.strict);
    this._commiting = false;
    this._module = module;
    this.mutations = {};
    this.actions = {};
    this.modules = {};
    this.plugins = module.plugins || [];
    this.extends = module.extends as any;

    this._state = observable.object<S>((module.state || {}) as any);
    this._getters = this._createGetters(module.getters);

    this.state =  observable.object<S>(this._createState() as S);
    this.getters = observable.object<G>(this._getters);

    let _mutations = module.mutations || {};
    this.mutations = {};
    Object.keys(_mutations).forEach(key => this.mutations[key] = action(`[react-vuex-like]${this.namespace}:${key}`, _mutations[key]));

    this.actions = module.actions ? { ...module.actions } : {};


    if (this.parent && moduleName) {
      this.parent._mergeState(this.moduleName, this.state);
      this.parent._mergeGetters(this.moduleName, this._getters);
      this.parent._mergeMutations(this.moduleName, this.mutations);
      this.parent._mergeActions(this.moduleName, this.actions);
    }

    if (module.modules) {
      Object.keys(module.modules).forEach(moduleName => {
        module.modules && this.registerModule(moduleName, (module.modules as any)[moduleName]);
      });
    }

    if (module.install) this.install = module.install.bind(this);

    if (this.plugins) this.plugins.forEach(p => p(this));
  }

  get namespace(): string {
    let moduleName = this.moduleName || 'root';
    return this.parent ? `${this.parent.namespace}/${moduleName}` : moduleName;
  }

  protected _createState(state?: Partial<any>) {
    if (!state) state = {};
    if (!this._state) return state;

    if (this._module.extends) this._module.extends._createState(state);

    Object.keys(this._state).forEach(key => {
      let set = (v: any) => {
        if (this.strict && !this._commiting) {
          throw new Error(`ReactVuexLike error: ''${key}' state can only be modified in mutation!`);
        }
        (this._state as any)[key] = v;
      };
      defComputed(
        state,
        key,
        () => this._state[key],
        set
      );
    });

    return state as S;
  }

  protected _createGetters(getters?: Partial<any>): G {
    if (!getters) getters = {};

    if (this._module.extends) this._module.extends._createGetters(getters);

    if (this._getters) {
      Object.keys(this._getters).forEach(key => defComputed(getters, key, () => {
        let get = this._getters[key] as any;
        return get(this.state, this.getters, this.root.state, this.root.getters);
      }));
    }

    return getters as G;
  }

  protected _getModuleKey(moduleName: string, key: string) {
    return this.namespaced ? `${moduleName}/${key}` : key;
  }

  protected _mergeState(moduleName: string, state: Partial<any>) {
    set(this.state, moduleName, state);
  }

  protected _mergeGetters(moduleName: string, getters: Partial<any>) {
    const newGetters = {};
    const keys = Object.keys(getters);
    if (!keys.length) return;
    keys.forEach(key => {
      const d = Object.getOwnPropertyDescriptor(getters, key);
      if (!d) return;
      defComputed(newGetters, this._getModuleKey(moduleName, key), d.get, d.set);
    });
    extendObservable(this.getters, newGetters);
    if (this.parent) this.parent._mergeGetters(this.moduleName, getters);
  }

  protected _mergeMutations(moduleName: string, mutations: Partial<any>) {
    const newMutations: Partial<any> = {};
    const keys = Object.keys(newMutations);
    if (!keys.length) return;
    keys.forEach((key: string) => newMutations[this._getModuleKey(moduleName, key)] = mutations[key]);
    Object.assign(this.mutations, newMutations);
    if (this.parent) this.parent._mergeMutations(this.moduleName, mutations);
  }

  protected _mergeActions(moduleName: string, actions: Partial<any>) {
    const newAtions: Partial<any> = {};
    const keys = Object.keys(newAtions);
    if (!keys.length) return;
    keys.forEach(key => newAtions[this._getModuleKey(moduleName, key)] = actions[key]);
    Object.assign(this.actions, newAtions);
    if (this.parent) this.parent._mergeActions(this.moduleName, actions);
  }

  protected _removeState(key: string) {
    remove(this.state, key);
  }

  protected _removeGetter(key: string) {
    remove(this.getters, key);
    if (this.parent) this.parent._removeGetter(this.parent._getModuleKey(this.moduleName, key));
  }

  protected _removeMutation(key: string) {
    delete this.mutations[key];
    if (this.parent) this.parent._removeMutation(this.parent._getModuleKey(this.moduleName, key));
  }

  protected _removeAction(key: string) {
    delete this.actions[key];
    if (this.parent) this.parent._removeAction(this.parent._getModuleKey(this.moduleName, key));
  }

  resetState() {
    return this.replaceState(this._module.state);
  }

  replaceState(state = {}) {
    const _state: Partial<any> = { ...state };

    Object.keys(this.modules).forEach(moduleName => _state[moduleName] = this.modules[moduleName].state || {});
    this._state = observable.object<S>(_state as S);
    this.state = observable.object<S>(this._createState() as S);
  }

  registerModule(moduleName: string, module?: StoreModule) {
    if (!moduleName) return;
    if (this.modules[moduleName]) this.unregisterModule(moduleName);
    if (!module) return;
    return this.modules[moduleName] = new Store(module, this as any, this.root, moduleName);
  }

  unregisterModule(moduleName: string) {
    const module = this.modules[moduleName];
    if (!module) return;

    this._removeState(moduleName);
    Object.keys(this.getters).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeGetter(key);
    });
    Object.keys(this.mutations).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeMutation(key);
    });
    Object.keys(this.actions).forEach(key => {
      if (key === this._getModuleKey(moduleName, key)) this._removeAction(key);
    });

    delete this.modules[moduleName];
  }

  watch(fn: () => any, callback: () => void) {
    let oldValue: any;
    return when(() => {
      let newValue = fn();
      let ret = newValue !== oldValue;
      oldValue = newValue;
      return ret;
    }, callback);
  }

  commit(event: string, payload: any): any {
    if (!event) return;

    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';
    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      let module = this.modules[moduleName];
      if (!module) {
        if (this.extends) return this.extends.commit(event, payload);
        throw new Error(`commit error: module '${moduleName}' not be found!`);
      }
      ret = module.commit(eventName, payload);
    } else {
      let mutation = this.mutations[event];
      if (!mutation) {
        if (this.extends) return this.extends.commit(event, payload);
        throw new Error(`commit error: event '${event}' not be found!`);
      }
      this._commiting = true;
      try {
        ret = mutation.call(this, this.state, payload, this.parent, this.root);
      } finally {
        this._commiting = false;
      }
    }

    this.mutationListeners.forEach(v => v({ type: 'UPDATE_DATA', payload }, this.state));
    return ret;
  }

  dispatch(event: string, payload: any): any {
    if (!event) return;

    const splitIdx = event.indexOf('/');
    let moduleName = '';
    let eventName = '';
    if (~splitIdx) {
      moduleName = event.substr(0, splitIdx);
      eventName = event.substr(splitIdx + 1, event.length);
    }

    let ret;

    if (eventName) {
      const module = this.modules[moduleName];
      if (!module) {
        if (this.extends) return this.extends.dispatch(event, payload);
        throw new Error(`commit error: module '${moduleName}' not be found!`);
      }
      ret = module.dispatch(eventName, payload);
    } else {
      const action = this.actions[event];
      if (!action) {
        if (this.extends) return this.extends.dispatch(event, payload);
        throw new Error(`commit error: event '${event}' not be found!`);
      }
      const { state, getters, commit } = this;
      ret = action.call(this, { state, getters, commit });
    }

    this.actionListeners.forEach(v => v({ type: 'UPDATE_DATA', payload }, this.state));
    return ret;
  }

  subscribe(handler: MutationListener) {
    if (!handler || this.mutationListeners.includes(handler)) return;
    this.mutationListeners.push(handler);
    return () => {
      const idx = this.mutationListeners.indexOf(handler);
      if (~idx) this.mutationListeners.splice(idx, 1);
    };
  }

  subscribeAction(handler: ActionListener) {
    if (!handler || this.actionListeners.includes(handler)) return;
    this.actionListeners.push(handler);
    return () => {
      const idx = this.actionListeners.indexOf(handler);
      if (~idx) this.actionListeners.splice(idx, 1);
    };
  }

  install(ReactVueLike: any, { App }: { App: any }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$store = this;
  }

}

export default Store;
