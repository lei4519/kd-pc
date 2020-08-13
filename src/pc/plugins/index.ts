import { VueConstructor } from 'vue'
// import { registerGlobalComponents } from './global-components'
import { registerAjax } from './axios'

export default function(Vue: VueConstructor) {
  // registerGlobalComponents(Vue)
  registerAjax(Vue)
}
