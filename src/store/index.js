import Vue from 'vue'
import Vuex from 'vuex'
import createModules from './modules'

Vue.use(Vuex)

export default axios => new Vuex.Store({
  strict: __DEV__,
  modules: createModules(axios)
})
