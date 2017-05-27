import Vue from 'vue'
import axios from 'axios'

const {prototype: proto} = Vue

axios.defaults.baseURL = (__SERVER__ ? INNER_SERVER : SERVER_PREFIX) + 'api'

if (!__DEV__ || !proto.__httpInstalled) {
  Object.defineProperty(proto, '$http', __SERVER__ ? {
    get() {
      return this.$vnode.ssrContext.axios
    }
  } : {value: axios})

  if (__DEV__) {
    proto.__httpInstalled = true
  }
}
