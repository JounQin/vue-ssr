import {app, router} from './app'

export default context => {
  const start = __DEV__ && Date.now()

  // set router's location
  router.push(context.url)
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  if (!matchedComponents.length) {
    return Promise.reject({code: '404'})
  }

  return Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch()
    }
  })).then(() => {
    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
    return app
  })
}
