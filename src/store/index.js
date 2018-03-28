import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

const SET_HTTP = 'SET_HTTP'

const actions = {
  setHttp({ commit }, axios) {
    commit(SET_HTTP, axios)
  },
}

const mutations = {
  [SET_HTTP](state, axios) {
    state.http = axios
  },
}

export default axios =>
  new Vuex.Store({
    strict: __DEV__,
    state: {
      http: axios,
    },
    actions,
    mutations,
    modules,
  })
