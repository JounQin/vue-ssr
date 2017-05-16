import Vue from 'vue'

import createRouter from 'router'
import createStore from 'store'

import 'plugins'

import App from 'views/App'

export default () => {
  require('styles/bootstrap')
  require('styles/app')

  const store = createStore()
  const router = createRouter(store)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return {app, router, store}
}
