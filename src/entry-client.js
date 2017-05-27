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

window.__INITIAL_STATE__ && store.replaceState(window.__INITIAL_STATE__)

if (__PROD__) require('vconsole')

const {documentElement: docEl} = document

const resize = () => {
  store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => {
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
})

if (module.hot) module.hot.accept()

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
