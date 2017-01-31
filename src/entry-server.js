import {app, router} from './app'

export default ({url}) => {
  const start = __DEV__ && Date.now()

  // set router's location
  router.push(url)
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  if (!matchedComponents.length) return Promise.reject({status: 404})

  return Promise.all(matchedComponents.map(component => component.preFetch && component.preFetch()))
    .then(() => {
      __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
      return app
    })
}
