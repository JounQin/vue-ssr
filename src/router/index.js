import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      component: __SERVER__ ? require('views/Home') : () => System.import('views/Home')
    },
    {
      name: 'test',
      path: '/test',
      component: __SERVER__ ? require('views/Test') : () => System.import('views/Test')
    }
  ]
})
