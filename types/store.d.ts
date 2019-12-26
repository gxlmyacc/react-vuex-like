export declare type MutationListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export declare type ActionListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export interface StoreBase {
    state: Partial<any>;
    getters: Partial<any>;
}
export interface StoreModule<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase = {
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
export declare type StorePlugin<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase = {
    state: Partial<any>;
    getters: Partial<any>;
}, M extends Partial<StoreModule> = {
    [key: string]: StoreModule;
}> = (store: Store<S, G, P, M>) => void;
declare class Store<S extends Partial<any> = Partial<any>, G extends Partial<any> = Partial<any>, P extends StoreBase = {
    state: Partial<any>;
    getters: Partial<any>;
}, M extends Partial<StoreModule> = {
    [key: string]: StoreModule;
}> implements StoreBase {
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
    protected root: any;
    protected parent?: any;
    protected mutationListeners: MutationListener[];
    protected actionListeners: ActionListener[];
    protected mutations: {
        [event: string]: (state: P['state'] & S & {
            [K in keyof M]: {
                [K in keyof M['state']]?: M['state'][K];
            };
        }, payload: any, parent?: Store, root?: Store) => any;
    };
    protected actions: {
        [event: string]: ({ state, getters, commit }: {
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
            commit: (event: string, payload: any) => any;
        }) => any;
    };
    protected modules: {
        [moduleName: string]: Store;
    };
    protected plugins: StorePlugin<S, G, P, M>[];
    protected extends?: Store;
    protected _commiting: boolean;
    protected _module: StoreModule<S, G, P, M>;
    protected _state: S;
    protected _getters: G;
    constructor(module: StoreModule<S, G, P, M>, parent?: Store, root?: Store, moduleName?: string);
    get namespace(): string;
    protected _createState(state?: Partial<any>): Partial<any>;
    protected _createGetters(getters?: Partial<any>): G;
    protected _getModuleKey(moduleName: string, key: string): string;
    protected _mergeState(moduleName: string, state: Partial<any>): void;
    protected _mergeGetters(moduleName: string, getters: Partial<any>): void;
    protected _mergeMutations(moduleName: string, mutations: Partial<any>): void;
    protected _mergeActions(moduleName: string, actions: Partial<any>): void;
    protected _removeState(key: string): void;
    protected _removeGetter(key: string): void;
    protected _removeMutation(key: string): void;
    protected _removeAction(key: string): void;
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
