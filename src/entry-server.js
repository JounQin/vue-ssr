import _axios from 'axios'

import createApp from './app'

export default context => new Promise((resolve, reject) => {
  const {ctx} = context

  const start = __DEV__ && Date.now()

  const axios = _axios.create()

  axios.defaults.headers = ctx.headers

  const {app, router, store} = createApp(axios)

  router.push(ctx.url)

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
