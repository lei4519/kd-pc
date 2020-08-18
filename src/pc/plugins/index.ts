import { VueConstructor } from 'vue'
import { registerGlobalComponents } from './global-components'
import { registerAjax } from './axios'
import { registerLoadManage } from '@/kd/components/AjaxLoading/LoadManage'

export default function(Vue: VueConstructor) {
  registerGlobalComponents(Vue)
  registerAjax(Vue)
  registerLoadManage(Vue)
}
