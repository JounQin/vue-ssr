import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = (__SERVER__ ? INNER_SERVER : SERVER_PREFIX) + 'api'

Vue.prototype.$http = axios
