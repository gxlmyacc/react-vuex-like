export declare type MutationListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export declare type ActionListener = (event: {
    type: string;
    payload: any;
}, state: Partial<any>) => void;
export interface StoreModule {
    namespaced: boolean;
    strict?: boolean;
    plugins?: StorePlugin[];
    extends?: Store;
    state: Partial<any>;
    getters?: Partial<any>;
    mutations?: Partial<any>;
    actions?: Partial<any>;
    modules?: {
        [moduleName: string]: StoreModule;
    };
    install?(ReactVueLike: any, options: {
        App: any;
    }): void;
}
export declare type StorePlugin = (store: Store) => void;
declare class Store {
    root: Store;
    parent?: Store;
    mutationListeners: MutationListener[];
    actionListeners: ActionListener[];
    moduleName: string;
    namespaced: boolean;
    strict: boolean;
    extends?: Store;
    state: Partial<any>;
    getters: Partial<any>;
    mutations: Partial<any>;
    actions: Partial<any>;
    modules: {
        [moduleName: string]: Store;
    };
    plugins: StorePlugin[];
    private _commiting;
    private _module;
    private _state;
    private _getters;
    constructor(module: StoreModule, parent?: Store, root?: Store, moduleName?: string);
    get namespace(): string;
    _createState(state?: Partial<any>): Partial<any>;
    _createGetters(getters?: Partial<any>): Partial<any>;
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
    registerModule(moduleName: string, module: StoreModule): Store | undefined;
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
