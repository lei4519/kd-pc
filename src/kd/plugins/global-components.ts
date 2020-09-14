import { VueConstructor } from 'vue'
import IconFont from '@/kd/components/IconFont/index.vue'
import InterfaceDoc from '@/kd/components/InterfaceDoc/index.vue'
import AjaxLoading from '@/kd/components/AjaxLoading/index.vue'
import AjaxLoadingGroup from '@/kd/components/AjaxLoading/AjaxLoadingGroup.vue'
export const registerGlobalComponents = (Vue: VueConstructor) => {
  const components = { IconFont, InterfaceDoc, AjaxLoadingGroup, AjaxLoading }
  Object.entries(components).forEach(([key, val]) => {
    Vue.component(key, val)
  })
}
