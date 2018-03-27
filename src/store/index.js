import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

const SET_AXIOS = 'SET_AXIOS'

const actions = {
  setAxios({ commit }, axios) {
    commit(SET_AXIOS, axios)
  },
}

const mutations = {
  [SET_AXIOS](state, axios) {
    state.axios = axios
  },
}

export default axios =>
  new Vuex.Store({
    strict: __DEV__,
    state: {
      axios,
    },
    actions,
    mutations,
    modules,
  })
