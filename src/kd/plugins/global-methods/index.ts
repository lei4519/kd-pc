import { VueConstructor } from 'vue'
import $ajax from './axios'
import { $loadManage } from '@/kd/components/AjaxLoading/LoadManage'

export const registerGlobalMethodss = (Vue: VueConstructor) => {
  const methods = { $ajax, $loadManage }
  Object.entries(methods).forEach(([key, val]) => {
    Vue.prototype[key] = val
  })
}
