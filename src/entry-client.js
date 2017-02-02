import 'styles/bootstrap'
import 'styles/app'

import {app, router} from './app'

router.onReady(() => app.$mount('#app'))

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
