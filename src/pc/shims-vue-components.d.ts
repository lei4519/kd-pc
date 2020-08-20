import Vue from 'vue'
import { LayoutInfo } from '@/kd/modules/Page'

declare module 'vue/types/options' {
  /**
   * @interface ComponentOptions
   * @param zhName 组件中文名称
   * @param iconClass // iconfont.cn 图表类名
   * @param maxSpan 最大占比 el-col span属性 默认24
   * @param minSpan 最小占比 el-col span属性 默认1
   * @param editorProps 组件配置区 配置
   * @param methods.fetchData 组件获取数据的方法统一命名 fetchData 由页面进行初始化调用
   * @param dragConfig 拖拽配置
   * @param dragConfig.max 当前页面可以放置当前组件的最大数量，默认无限制, 1 以上为有效值
   * @param dragConfig.onDrop 拖拽放下事件，接收当前页面布局信息，返回boolean来控制是否可以被放下
   */
  export interface ComponentOptions<V extends Vue> {
    zhName?: string
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
