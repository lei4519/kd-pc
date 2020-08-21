import Vue from 'vue'
import { AxiosInstance } from 'axios'
import { LoadManage } from '@/kd/components/AjaxLoading/LoadManage'
declare module '*.vue' {
  export default Vue
}
declare module 'vue/types/vue' {
  /**
   * @property {} $ajax axios 实例
   * @property {} $loadManage 全局请求loading 状态管理实例 配合AjaxLoading组件使用
   */
  interface Vue {
    $ajax: AxiosInstance
    $loadManage: LoadManage
  }
}
