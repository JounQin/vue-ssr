import Vue from 'vue'

import router from 'router'

import App from 'views/App'

export const router$ = router

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router
})
