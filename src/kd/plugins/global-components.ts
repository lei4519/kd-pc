import { VueConstructor } from 'vue'
import IconFont from '@/kd/components/IconFont/index.vue'
import InterfaceDoc from '@/kd/components/InterfaceDoc/index.vue'
export const registerGlobalComponents = (Vue: VueConstructor) => {
  const components = { IconFont, InterfaceDoc }
  Object.entries(components).forEach(([key, val]) => {
    Vue.component(key, val)
  })
}
