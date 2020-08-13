import { VueConstructor } from 'vue'
import axios from 'axios'
export const registerAjax = (Vue: VueConstructor) => {
  Vue.prototype.$ajax = axios.create()
}
