import 'vue-tsx-support/enable-check'
import { EditorProps } from '@/kd/types/editor-props'
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {}
  }
}

declare module 'vue/types/options' {
  /**
   * @interface ComponentOptions
   * @param zhName 组件中文名称
   * @param iconClass // iconfont.cn 图表类名
   * @param maxSpan 最大占比 el-col span属性 默认24
   * @param minSpan 最小占比 el-col span属性 默认1
   * @param editorProps 组件配置区 配置
   */
  interface ComponentOptions<V extends Vue> {
    zhName?: string
    iconClass?: string
    maxSpan?: number
    minSpan?: number
    editorProps?: EditorProps
  }
}
