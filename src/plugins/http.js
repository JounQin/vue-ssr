import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = SERVER_PREFIX + 'api'

Object.defineProperty(
  Vue.prototype,
  '$http',
  __SERVER__
    ? {
        get() {
          return this.$ssrContext.axios
        },
        configurable: __DEV__,
      }
    : {
        value: axios,
        writable: __DEV__,
      },
)
