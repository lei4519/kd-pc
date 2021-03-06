import Vue from 'vue'
import { LayoutInfo } from '@/kd/modules/Page'
import { EditorProps } from '@/kd/types/editor-props'
import { CommonSetting } from '@/kd/types/common-setting'

declare module 'vue/types/options' {
  /**
   * @interface ComponentOptions
   * @property {} zhName 组件中文名称
   * @property {} iconClass iconfont.cn 图表类名
   * @property {} commonSetting commonSetting 控制通用设置的某一项是否显示
   * @property {} needParentStyle 默认 true，自动给元素加上阴影和 hover 边框样式
   * @property {} maxSpan 最大占比 el-col span属性 默认24
   * @property {} minSpan 最小占比 el-col span属性 默认1
   * @property {} editorProps 组件配置区 配置
   * @property {} methods.fetchData 组件获取数据的方法统一命名 fetchData 由页面进行初始化调用, fetchData方法必须返回promise
   * @property {} dragConfig 拖拽配置
   * @property {} dragConfig.max 当前页面可以放置当前组件的最大数量，默认无限制, 1 以上为有效值
   * @property {} dragConfig.onDrop 拖拽放下事件，接收当前页面布局信息，返回boolean来控制是否可以被放下。函数内的this为编辑区组件实例
   * @property { LayoutInfo } this.$attrs.layouts 布局信息，详情查看 LayoutInfo 接口
   */
  export interface ComponentOptions<V extends Vue> {
    zhName?: string
    commonSetting?: CommonSetting
    needParentStyle?: boolean
    iconClass?: string
    maxSpan?: number
    minSpan?: number
    editorProps?: EditorProps
    dragConfig?: {
      max?: number
      onDrop?: (layouts: LayoutInfo) => boolean
    }
  }
}
