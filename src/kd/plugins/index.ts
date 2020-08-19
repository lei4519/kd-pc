import { VueConstructor } from 'vue'
import { registerGlobalComponents } from './global-components'
import { registerGlobalMethodss } from './global-methods'

/**
 * @description 统一注册全局插件、组件、方法的地方
 */
export default function(Vue: VueConstructor) {
  registerGlobalComponents(Vue)
  registerGlobalMethodss(Vue)
}
