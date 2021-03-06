import { setRoutes } from '@/kd/router/utils'
import { Project, ProjectProps } from '@/kd/modules/Project'

interface State {
  project: Project | null
}
interface Mutation {
  SET_PROJECT: (state: State, projectProps: ProjectProps) => void
  [key: string]: any
}
const state: State = {
  project: null
}
const mutations: Mutation = {
  SET_PROJECT(state, projectProps) {
    const project = new Project(
      {
        name: '',
        themeColor: '#409EFF',
        themeEl: document.documentElement,
        menu: [
          {
            type: 'menu',
            name: '系统管理',
            show: true,
            children: [
              {
                type: 'page',
                name: '单页列表',
                show: true,
                routeName: 'SinglePageList'
              }
            ]
          }
        ]
      } || projectProps
    )
    setRoutes(project.menu)
    state.project = project
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
