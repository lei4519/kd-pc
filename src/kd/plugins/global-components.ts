import { VueConstructor } from 'vue'
import IconFont from '@/kd/components/IconFont/index.vue'
import DocumentTable from '@/kd/components/utils/DocumentTable.vue'
export const registerGlobalComponents = (Vue: VueConstructor) => {
  const components = { IconFont, DocumentTable }
  Object.entries(components).forEach(([key, val]) => {
    Vue.component(key, val)
  })
}
