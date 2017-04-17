import {app, router, store} from './app'

import {on} from 'utils'

import {throttle} from 'lodash'

window.__INITIAL_STATE__ && store.replaceState(window.__INITIAL_STATE__)

const {documentElement: docEl} = document

const resize = () => {
  store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => app.$mount('#app'))

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
