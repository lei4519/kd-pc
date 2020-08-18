import { VueConstructor } from 'vue';
import AjaxLoading from '@/kd/components/AjaxLoading/index.vue'
import AjaxLoadingGroup from '@/kd/components/AjaxLoading/AjaxLoadingGroup.vue'

export const registerGlobalComponents = (Vue: VueConstructor) => {
  const components = {AjaxLoading, AjaxLoadingGroup}
  Object.entries(components).forEach(([key, val]) => {
    Vue.component(key, val)
  })
}