import { VueConstructor } from 'vue'
import { registerGlobalComponents } from './global-components'
import { registerAjax } from './axios'
import { registerLoadManage } from '@/kd/components/AjaxLoading/LoadManage'
/**
 * @description 统一注册全局插件、组件、方法的地方
 */
export default function(Vue: VueConstructor) {
  registerGlobalComponents(Vue)
  registerAjax(Vue)
  registerLoadManage(Vue)
}
