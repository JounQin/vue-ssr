import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default store => {
  const {dispatch} = store

  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        name: 'home',
        path: '/',
        component: () => import('views/Home')
      }
    ]
  })

  let first = true

  router.beforeEach((to, from, next) => {
    first || dispatch('setProgress', 50)
    next()
  })

  router.afterEach(() => {
    if (first) return (first = false)
    dispatch('setProgress', 100)
  })

  return router
}
