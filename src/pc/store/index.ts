import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import project from './modules/project'
import theme from './modules/theme'
Vue.use(Vuex)
export type RootStore = Store<RootState>
interface RootState {
  project: typeof project.state
}
const store = new Vuex.Store<RootState>({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    project,
    theme
  }
})

export default store
