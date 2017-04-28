import {throttle} from 'lodash'

import {createApp} from './app'
import {on} from 'utils'

const {app, router, store} = createApp()

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
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false

    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }

    Promise.all(activated.map(comp => {
      if (comp.asyncData) {
        return comp.asyncData({store, route: to})
      }
    })).then(() => {
      next()
    }).catch(next)
  })

  app.$mount('#app')
})

if (module.hot) module.hot.accept()

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
