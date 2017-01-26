import Vue from 'vue'

import router from 'router'

import App from 'views/App'

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  ...App
})
