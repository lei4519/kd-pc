import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { beforeEach, afterEach } from './utils'
Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/kd/views/Login.vue')
  }
]
const router = new VueRouter({
  routes
})

// 拦截器
router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router
