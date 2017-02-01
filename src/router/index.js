import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
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
