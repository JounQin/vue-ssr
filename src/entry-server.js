import {createApp} from './app'

export default context => new Promise((resolve, reject) => {
  const start = __DEV__ && Date.now()

  const {app, router, store} = createApp(context)

  router.push(context.url)

  router.onReady(async () => {
    await Promise.all(router.getMatchedComponents().map(({asyncData}) => asyncData && asyncData({
      store,
      route: router.currentRoute
    })))

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
    context.state = store.state
    resolve(app)
  }, reject)
})
