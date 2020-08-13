import { setRoutes } from '@/kd/router'
import { Menu, Page } from '@/kd/modules/Menu'

export type MenuConfig = Array<Menu | Page>

interface State {
  menu: MenuConfig
}
interface Mutation {
  SET_MENU: (state: State, menu: MenuConfig) => void
  [key: string]: any
}
const state: State = {
  menu: []
}
const mutations: Mutation = {
  SET_MENU(state, menu) {
    menu = [
      {
        type: 'menu',
        name: '系统管理',
        show: true,
        children: [
          {
            type: 'page',
            name: '新建/编辑系统',
            show: true,
            routeName: 'AddSystem'
          },
          {
            type: 'page',
            name: '编辑页面',
            show: true,
            routeName: 'EditPage'
          }
        ]
      }
    ]
    setRoutes(menu)
    state.menu = menu
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
