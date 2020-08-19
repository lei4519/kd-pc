import Vue from 'vue'

declare module 'vue/types/options' {
  /**
   * @interface ComponentOptions
   * @param zhName 组件中文名称
   * @param iconClass // iconfont.cn 图表类名
   * @param maxSpan 最大占比 el-col span属性 默认24
   * @param minSpan 最小占比 el-col span属性 默认1
   * @param editorProps 组件配置区 配置
   * @param methods.fetchData 组件获取数据的方法统一命名 fetchData 由页面进行初始化调用
   */
  interface ComponentOptions<V extends Vue> {
    zhName?: string
    iconClass?: string
    maxSpan?: number
    minSpan?: number
    editorProps?: EditorProps
  }
}
