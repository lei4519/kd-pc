import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { MenuConfig } from '../store/modules/menu'
import store from '../store'
import { Menu, Page } from '@/kd/modules/Menu'
Vue.use(VueRouter)

/* 路由映射表 */
interface RouteMap {
  [key: string]: {
    path: string
    name: string
    component: any
    meta?: object
  }[]
}
/*
    值为数组的原因是，我们映射的只是作为菜单项的路由名称
    有些路由并不是菜单项，却又和菜单路由息息相关，这些路由需要和菜单项一起添加或删除
  */
const routeMap: RouteMap = {
  AddSystem: [
    {
      path: 'AddSystem',
      name: 'AddSystem',
      component: () => import('@/kd/views/system/add.vue')
    }
  ],
  EditLayout: [
    {
      path: 'EditLayout',
      name: 'EditLayout',
      component: () => import('@/kd/components/EditLayout.vue')
    }
  ]
}
/* 路由映射表 */

/* 通过配置项生成最终的路由表 */
const LoginRouter = {
  path: '/login',
  name: 'Login',
  // component: login,
  meta: {
    redirect: {}
  }
}
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    redirect: '/home'
  },
  LoginRouter
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export function setRoutes(menu: MenuConfig) {
  let routeID = 0
  // 主页面路由
  const HomeRoute: RouteConfig = {
    path: '/home',
    name: 'Home',
    component: () => import('@/kd/views/Home.vue'),
    children: []
  }
  const set = new Set()
  const normalize = (menu: MenuConfig) => {
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i]
      // show为假值 其下页面不再显示
      if (!item.show) {
        menu.splice(i, 1)
        i--
      } else {
        item.routeID = routeID++
        const isMenu = (item: Menu | Page): item is Menu => item.type === 'menu'
        if (isMenu(item)) {
          if (item.children) {
            normalize(item.children)
          }
        } else {
          // 其权限的第一个页面作为首页
          if (!LoginRouter.meta.redirect) {
            LoginRouter.meta.redirect = { name: item.routeName }
          }
          const dynamicRoutes = routeMap[item.routeName!]
          if (dynamicRoutes) {
            // 操作级权限 及与操作对应的路由移除
            if (item.permissions && item.permissions.length) {
              const route = dynamicRoutes.find(r => r.name === item.routeName)!
              const meta = item.permissions.reduce((m, p) => {
                m[p.name] = Boolean(p.show)
                return m
              }, {} as any)
              route.meta = Object.assign({}, route.meta || {}, meta)
            }
            // 将与此页面相关的路由注册进去
            dynamicRoutes.forEach(r => {
              if (set.has(r.name)) return
              set.add(r.name)
              HomeRoute.children!.push(r)
            })
          }
        }
      }
    }
  }
  normalize(menu)
  router.addRoutes([HomeRoute])
  return menu
}
export function resetRouter() {
  ;(router as any).matcher = (new VueRouter({
    routes
  }) as any).matcher
}

/* 通过配置项生成最终的路由表 */
export default router

// 拦截器
router.beforeEach((to, from, next) => {
  // determine whether the user has logged in
  const whiteList: string[] = []
  const isLogin = true
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next('/')
    } else {
      // 是否有navData
      if (store.state.menu.menu.length <= 0) {
        // 浏览器刷新时navData为空，重新设置
        const navBar = [1] || JSON.parse(localStorage.getItem('navBar') || '[]')
        if (navBar.length) {
          store.commit('menu/SET_MENU')
          next(to.path)
        } else {
          // 如果登录成功了却没有获取到navData，就返回重新登录
          next(`/login?redirect=${to.path}`)
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }

  document.body.scrollTop = document.documentElement.scrollTop = 0
})
