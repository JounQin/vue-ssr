import 'styles/bootstrap'
import 'styles/app'

import Vue from 'vue'

import $router from 'router'
import $store from 'store'

import 'plugins'

import App from 'views/App'

export const router = $router
export const store = $store

if (module.hot) module.hot.accept()

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router,
  store
})
