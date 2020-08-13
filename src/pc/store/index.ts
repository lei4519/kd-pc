import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import menu from './modules/menu'
Vue.use(Vuex)
export type RootStore = Store<RootState>
interface RootState {
  menu: typeof menu.state
}
const store = new Vuex.Store<RootState>({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    menu
  }
})

export default store
