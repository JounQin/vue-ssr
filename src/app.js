import 'styles/bootstrap'
import 'styles/app'

import Vue from 'vue'

import router from 'router'
import store from 'store'

import 'plugins'

import App from 'views/App'

if (module.hot) module.hot.accept()

export const app = new Vue({
  ...App,
  router,
  store
})

export {router, store}
