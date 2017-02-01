import {app, router} from './app'

export default ({url}) => {
  const start = __DEV__ && Date.now()

  return new Promise((resolve, reject) => {
    // set router's location
    router.push(url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // no matched routes
      if (!matchedComponents.length) return reject({status: 404})

      Promise.all(matchedComponents.map(component => component.preFetch && component.preFetch()))
        .then(() => {
          __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
          resolve(app)
        })
        .catch(reject)
    })
  })
}
