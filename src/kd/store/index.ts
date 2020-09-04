import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import project from './modules/project'
import user from './modules/user'
Vue.use(Vuex)
export type RootStore = Store<RootState>
interface RootState {
  project: typeof project.state
  user: typeof user.state
}
const store = new Vuex.Store<RootState>({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    project,
    user
  }
})

export default store
