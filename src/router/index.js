import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const esModule = module => module.then(m => m.default)

export default store => {
  const {dispatch} = store

  const router = new VueRouter({
    mode: 'history',
    fallback: false,
    routes: [
      {
        name: 'home',
        path: '/',
        component: () => import('views/Home')
      },
      {
        name: 'articles',
        path: '/articles',
        component: () => import('views/Articles')
      },
      {
        name: 'article',
        path: '/article/:id(\\d+)',
        component: () => import('views/Articles/ArticleItem')
      },
      {
        name: 'test',
        path: '/test',
        component: () => esModule(import('views/Test'))
      },
      {
        name: 'redirect',
        path: '/redirect',
        redirect: '/'
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
