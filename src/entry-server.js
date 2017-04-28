import {createApp} from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const start = __DEV__ && Date.now()
    const {app, router, store} = createApp(context)

    router.push(context.url)

    router.onReady(() => {
      Promise.all(router.getMatchedComponents().map(component => component.asyncData && component.asyncData({
        store,
        route: router.currentRoute
      })))
        .then(() => {
          __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
          context.state = store.state
          resolve(app)
        })
        .catch(reject)
    }, reject)
  })
}
