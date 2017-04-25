import Vue from 'vue'
import VueRouter from 'vue-router'

import store from 'store'

const {dispatch} = store

Vue.use(VueRouter)

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

export default router
