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
      component: () => System.import('views/Home')
    },
    {
      name: 'test',
      path: '/test',
      component: () => System.import('views/Test')
    }
  ]
})

router.beforeEach((to, from, next) => {
  dispatch('setProgress', 50)
  next()
})

router.afterEach(() => {
  dispatch('setProgress', 100)
})

export default router
