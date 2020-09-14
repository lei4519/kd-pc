import { RouteConfig } from 'vue-router'

/* 路由映射表 */
interface RouteMap {
  [key: string]: RouteConfig[]
}
/*
    值为数组的原因是，我们映射的只是作为菜单项的路由名称
    有些路由并不是菜单项，却又和菜单路由息息相关，这些路由需要和菜单项一起添加或删除
  */
export const routeMap: RouteMap = {
  SystemList: [
    {
      path: 'SystemList',
      name: 'SystemList',
      component: () => import('@/kd/views/SystemManage/SystemList/index.vue')
    },
    {
      path: 'SystemEdit',
      name: 'SystemEdit',
      component: () => import('@/kd/views/SystemManage/SystemList/edit.vue')
    }
  ],
  SinglePageList: [
    {
      path: 'SinglePageList',
      name: 'SinglePageList',
      component: () =>
        import('@/kd/views/SystemManage/SinglePageList/index.vue')
    },
    {
      path: 'EditSinglePage',
      name: 'EditSinglePage',
      component: () =>
        import('@/kd/views/SystemManage/SinglePageList/EditSinglePage.vue')
    }
  ],
  RoleSetting: [
    {
      path: 'RoleSetting',
      name: 'RoleSetting',
      component: () => import('@/kd/views/SystemManage/RoleSetting/index.vue')
    }
  ]
}
