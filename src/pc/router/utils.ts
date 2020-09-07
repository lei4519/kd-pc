import { Children } from '@/kd/modules/Menu'
import VueRouter, { RouteConfig, NavigationGuard, Route } from 'vue-router'
import router, { routes } from './index'
import { routeMap } from './routeMap'
import store from '../store'
import { Page } from '@/kd/modules/Page'

/**
 * @description 权限控制，注册路由
 */
export function setRoutes(menu: Children[]) {
  // 主页面路由
  const HomeRoute: RouteConfig = {
    path: '/home',
    name: 'Home',
    redirect: '',
    component: () => import('@/kd/views/Home.vue'),
    children: []
  }
  const set = new Set()
  const accessControl = (menu: Children[]): void => {
    for (let i = 0; i < menu.length; i++) {
      const item = menu[i]
      // 页面权限 show为假值 其下页面不再显示
      if (!item.show) {
        menu.splice(i, 1)
        i--
      } else {
        const isPage = (item: Children): item is Page => item.type === 'page'
        if (isPage(item)) {
          // 其权限的第一个页面作为首页
          if (!HomeRoute.redirect) {
            HomeRoute.redirect = { name: item.routeName }
          }
          const dynamicRoutes = routeMap[item.routeName!]
          if (dynamicRoutes?.length) {
            let route: any
            dynamicRoutes.forEach(r => {
              r.meta = Object.assign(r.meta || {}, {
                menuActiveName: item.routeName
              })
              if (r.name === item.routeName) {
                route = r
              }
            })
            // 操作级权限
            if (item.permissions?.length) {
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
        } else {
          if (item.children?.length) {
            return accessControl(item.children)
          }
        }
      }
    }
  }
  accessControl(menu)
  router.addRoutes([HomeRoute])
  return menu
}
/**
 * @description 重置路由
 */
export function resetRouter() {
  ;(router as any).matcher = (new VueRouter({
    routes
  }) as any).matcher
}
// 拦截器
export const beforeEach: NavigationGuard = (to, from, next) => {
  // determine whether the user has logged in
  const whiteList: string[] = ['/login', '/SinglePageApp']
  const isLogin = true
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next('/')
    } else {
      // 是否有项目信息
      if (!store.state.project.project) {
        // 浏览器刷新时project为空，重新设置
        const project = JSON.parse(localStorage.getItem('project') || 'null')
        // TEST 测试使用
        // 正常情况有project才会进行commit
        if (!project) {
          store.commit('project/SET_PROJECT')
          next(to.path)
        } else {
          // 如果登录成功了却没有获取到menu，就返回重新登录
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
}

export const afterEach = (to: Route) => {
  // localStorage.setItem('routeName', to.name!)
}
