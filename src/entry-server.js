import {app, router} from './app'

export default ({url}) => {
  const start = __DEV__ && Date.now()

  return new Promise((resolve, reject) => {
    router.push(url)

    router.onReady(() => {
      Promise.all(router.getMatchedComponents().map(component => component.preFetch && component.preFetch()))
        .then(() => {
          __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
          resolve(app)
        })
        .catch(reject)
    })
  })
}
