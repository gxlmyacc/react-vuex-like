/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param,
 *                                you can do something for state and getters in it.
 * @param {Object}
 */
export declare const mapState: (namespace: string, map: any[] | Partial<any>) => any;
/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as
 *                                   the first param, it can accept anthor params. You can commit mutation
 *                                   and do any other things in this function. specially, You need to pass
 *                                   anthor params from the mapped function.
 * @return {Object}
 */
export declare const mapMutations: (namespace: string, map: any[] | Partial<any>) => any;
/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
export declare const mapGetters: (namespace: string, map: any[] | Partial<any>) => any;
/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the
 *                                 first param, it can accept anthor params. You can dispatch action and do
 *                                 any other things in this function. specially, You need to pass anthor
 *                                 params from the mapped function.
 * @return {Object}
 */
export declare const mapActions: (namespace: string, map: any[] | Partial<any>) => any;
/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */
export declare const createNamespacedHelpers: (namespace: string) => {
    mapState: (map: any[] | Partial<any>) => any;
    mapGetters: (map: any[] | Partial<any>) => any;
    mapMutations: (map: any[] | Partial<any>) => any;
    mapActions: (map: any[] | Partial<any>) => any;
};
