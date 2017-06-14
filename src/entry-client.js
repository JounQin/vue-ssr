import Vue from 'vue'
import axios from 'axios'
import {throttle} from 'lodash'

import createApp from './app'
import {on} from 'utils'

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  async beforeRouteUpdate(to, from, next) {
    const {asyncData} = this.$options
    try {
      asyncData && await asyncData({store: this.$store, route: to})
    } catch (e) {
    }
    next()
  }
})

const {app, router, store} = createApp(axios)

const {__INITIAL_STATE__} = window

if (__INITIAL_STATE__) {
  store.replaceState(__INITIAL_STATE__)
  if (__PROD__) {
    delete window.__INITIAL_STATE__
  }
}

const {documentElement: docEl} = document

const setSize = () => store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})

on(window, 'resize', throttle(() => {
  setSize()
  docEl.style.fontSize = store.getters.fontSize + 'px'
}, 300))

setSize()

const ready = () => {
  router.beforeResolve(async (to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    if (!prevMatched) return next()

    let diffed = false

    const activated = matched.filter((comp, index) => diffed || (diffed = (prevMatched[index] !== comp)))

    try {
      activated.length && await Promise.all(activated.map(({asyncData}) => asyncData && asyncData({store, route: to})))
    } catch (e) {
    }

    next()
  })

  app.$mount('#app')

  if (__PROD__) {
    require('vconsole')
  }
}

__INITIAL_STATE__ ? router.onReady(ready) : ready()

if (module.hot) module.hot.accept()

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
