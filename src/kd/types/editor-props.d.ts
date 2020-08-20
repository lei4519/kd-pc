/**
 * @description 返回组件的配置项描述
 */
export type EditorProps = (env?: string) => EditorSection[]
/**
 * @description 配置区域分组
 * @param title 分组名称
 * @param props 修改prop属性的配置
 */
interface EditorSection {
  title: string
  props: Array<Type>
}
type Type =
  | CustomEditor
  | Select
  | Input
  | Radio
  | Switch
  | Slider
  | InputNumber
  | DataSource

/**
 * @description 通用配置
 * @param label el-formItem label
 * @param prop 要修改的props值
 * @param tips 属性相关提示 支持传入文字 或者 render函数; 文字使用el-tooltip渲染，render函数使用 el-dialog 渲染
 * @param formItemProps 此属性会作为 el-formItem 的props传入其中
 * @param formCompProps 此属性会作为 表单项(如el-input el-radio) 的props传入其中
 * @param defaultValue 默认的props值，可以不写。会自动从vue文件的props - default中取
 */
interface FormItem {
  label?: string
  prop: string
  tips?:
    | ((createElement: CreateElement, hack: RenderContext<Props>) => VNode)
    | string
  formItemProps?: object
  formCompProps?: object
  defaultValue?: any
}
/**
 * @description 自定义渲染配置
 * @param custom 是否为自定义渲染，固定传true值
 * @param componentPath 相对当前文件的自定义编辑组件路径，以 -editor.vue 结尾，否则会被当作正常组件读取
 * @param component （开发组件时不要填写此值）自定义编辑组件对象，由getComponents方法自动获取。
 */
export interface CustomEditor extends FormItem {
  custom: boolean
  componentPath?: string
  component?: Vue.ComponentOptions
}
/**
 * @description 输入框
 */
interface Input extends FormItem {
  type: 'input'
}
/**
 * @description 数字输入框
 */
interface InputNumber extends FormItem {
  type: 'inputNumber'
}
/**
 * @description 开关
 */
interface Switch extends FormItem {
  type: 'switch'
}
/**
 * @description 滑块
 */
interface Slider extends FormItem {
  type: 'slider'
}
/**
 * @description 下拉框
 */
interface Select extends FormItem {
  type: 'select'
  options: {
    label: string
    value: string
  }[]
}
/**
 * @description 单选框
 */
interface Radio extends FormItem {
  type: 'radio'
  options: {
    label: string
    value: string
  }[]
}
/**
 * @description 数据源选择
 */
interface DataSource {
  type: 'dataSource'
}
