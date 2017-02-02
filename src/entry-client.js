import 'styles/bootstrap'
import 'styles/app'

import {app, router, store} from './app'

import {on, throttle} from 'utils'

const {documentElement: docEl, body} = document

const resize = () => {
  const winHeight = docEl.clientHeight
  store.dispatch('setSize', {winHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
  body.style.height = winHeight + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => app.$mount('#app'))

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
