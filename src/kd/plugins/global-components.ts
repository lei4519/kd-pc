import { VueConstructor } from 'vue'
import IconFont from '@/kd/components/IconFont/index.vue'
export const registerGlobalComponents = (Vue: VueConstructor) => {
  const components = { IconFont }
  Object.entries(components).forEach(([key, val]) => {
    Vue.component(key, val)
  })
}
