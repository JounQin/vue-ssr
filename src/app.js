import Vue from 'vue'

import router$ from 'router'

export const router = router$

import App from 'views/App'

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router
})
