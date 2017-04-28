import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export const createStore = () => new Vuex.Store({
  strict: __DEV__,
  modules
})
