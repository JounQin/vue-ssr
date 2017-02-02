import Vue from 'vue'

import router$ from 'router'
import store$ from 'store'

export const router = router$
export const store = store$

import App from 'views/App'

if (module.hot) module.hot.accept()

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router,
  store
})
