# react-vuex-like

[![NPM version](https://img.shields.io/npm/v/react-vuex-like.svg?style=flat)](https://npmjs.com/package/react-vuex-like)
[![NPM downloads](https://img.shields.io/npm/dm/react-vuex-like.svg?style=flat)](https://npmjs.com/package/react-vuex-like)

a react state manager that like vuex, implementation based on mbox@4.


## Installation

```bash
npm install react-vuex-like --save
# or
yarn add react-vuex-like
```

## Usage

store like Vuex.Store:
```js
import { Store } from 'react-vuex-like';

const store = new Store({
  modules: {
    child1: {
      state: {
        aa: true
      }
    },
    child2: {
      state: {
        bb: true
      }
    }
  },
  state: {
    user: {
      name: 'name1'
    },
  },
  getters: {
    aa(state) {
      return state.globalLoading;
    }
  }
  mutations: {
    'update-user'(state, v) {
      state.user = v;
    },
    'update-user-info'(state, v) {
      Object.keys(v).forEach(key => state.user[key] = v[key]);
    }
  },
  actions: {
    'update-user-info'({ commit }, v) {
      commit('update-user', v);
    }
  },
});

export default store;
```

### Helpers Methods

support `mapState`,`mapMutations`,`mapGetters`,`mapActions`,`createNamespacedHelpers`. see [Vuex](https://vuex.vuejs.org/guide/)

## License

[MIT](./LICENSE)
