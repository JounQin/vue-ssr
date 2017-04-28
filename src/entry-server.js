import regeneratorRuntime from 'regenerator-runtime'

import {createApp} from './app'

global.regeneratorRuntime = regeneratorRuntime

export default context => new Promise((resolve, reject) => {
  const start = __DEV__ && Date.now()

  const {app, router, store} = createApp(context)

  router.push(context.url)

  router.onReady(async () => {
    try {
      await Promise.all(router.getMatchedComponents().map(({asyncData}) => asyncData && asyncData({
        store,
        route: router.currentRoute
      })))
    } catch (e) {
      reject(e)
    }

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
    context.state = store.state
    resolve(app)
  }, reject)
})
