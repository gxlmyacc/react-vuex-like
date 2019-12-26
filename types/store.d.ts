export declare type MutationListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export declare type ActionListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export interface StoreBase<S> {
    state: Partial<any>;
    getters: Partial<any>;
}
export interface StoreModule<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase<StoreModule> = {
    state: Partial<any>;
    getters: Partial<any>;
}, M extends Partial<StoreModule> = {
    [key: string]: StoreModule;
}> {
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
    };
    install?(ReactVueLike: any, options: {
        App: any;
    }): void;
}
export declare type StorePlugin<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase<Store> = {
    state: Partial<any>;
    getters: Partial<any>;
}, M extends Partial<StoreModule> = {
    [key: string]: StoreModule;
}> = (store: Store<S, G, P, M>) => void;
declare class Store<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase<StoreModule> = {
    state: Partial<any>;
    getters: Partial<any>;
}, M extends Partial<StoreModule> = {
    [key: string]: StoreModule;
}> implements StoreBase<Store> {
    state: P['state'] & S & {
        [K in keyof M]: {
            [K in keyof M['state']]?: M['state'][K];
        };
    };
    getters: P['getters'] & G & {
        [K in keyof M]: {
            [K in keyof M['getters']]?: M['getters'][K];
        };
    };
    readonly moduleName: string;
    readonly namespaced: boolean;
    readonly strict: boolean;
    private root;
    private parent?;
    private mutationListeners;
    private actionListeners;
    private mutations;
    private actions;
    private modules;
    private plugins;
    private extends?;
    private _commiting;
    private _module;
    private _state;
    private _getters;
    constructor(module: StoreModule<S, G, P, M>, parent?: Store, root?: Store, moduleName?: string);
    get namespace(): string;
    _createState(state?: Partial<any>): Partial<any>;
    _createGetters(getters?: Partial<any>): G;
    _getModuleKey(moduleName: string, key: string): string;
    _mergeState(moduleName: string, state: Partial<any>): void;
    _mergeGetters(moduleName: string, getters: Partial<any>): void;
    _mergeMutations(moduleName: string, mutations: Partial<any>): void;
    _mergeActions(moduleName: string, actions: Partial<any>): void;
    _removeState(key: string): void;
    _removeGetter(key: string): void;
    _removeMutation(key: string): void;
    _removeAction(key: string): void;
    resetState(): void;
    replaceState(state?: {}): void;
    registerModule(moduleName: string, module?: StoreModule): Store<Partial<any>, Partial<any>, {
        state: Partial<any>;
        getters: Partial<any>;
    }, {
        [key: string]: StoreModule<Partial<any>, Partial<any>, {
            state: Partial<any>;
            getters: Partial<any>;
        }, any>;
    }> | undefined;
    unregisterModule(moduleName: string): void;
    watch(fn: () => any, callback: () => void): import("mobx").IReactionDisposer;
    commit(event: string, payload: any): any;
    dispatch(event: string, payload: any): any;
    subscribe(handler: MutationListener): (() => void) | undefined;
    subscribeAction(handler: ActionListener): (() => void) | undefined;
    install(ReactVueLike: any, { App }: {
        App: any;
    }): void;
}
export default Store;
