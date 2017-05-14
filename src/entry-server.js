import createApp from './app'

export default context => new Promise((resolve, reject) => {
  const start = __DEV__ && Date.now()

  const {app, router, store} = createApp()

  router.push(context.url)

  router.onReady(async () => {
    const matched = router.getMatchedComponents()

    if (!matched.length) return reject({status: 404})

    await Promise.all(matched.map(({asyncData}) => asyncData && asyncData({
      store,
      route: router.currentRoute
    })))

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
    context.state = store.state
    resolve(app)
  }, reject)
})
