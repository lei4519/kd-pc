import { VueConstructor } from 'vue'
import { skeleton } from '@/kd/components/AjaxLoading/directives'

export const registerGlobalDirectives = (Vue: VueConstructor) => {
  const directives = { skeleton }
  Object.entries(directives).forEach(([key, val]) => {
    Vue.directive(key, val)
  })
}
