/**
 * @description 返回组件的配置项描述
 * @property {} props 传入组件的props对象，可以根据props的变化来返回不同的配置项
 * @waring 传入的props对象没有setter 只能读取值，不能修改值。
 */
export type EditorProps = (props: Object) => EditorSection[]
/**
 * @description 配置区域分组
 * @property {} title 分组名称
 * @property {} props 修改prop属性的配置
 */
interface EditorSection {
  title: string
  props: Array<EditorSectionProps>
}
type EditorSectionProps =
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
 * @property {} label el-formItem label
 * @property {} prop 要修改的props值
 * @property {} tips 属性相关提示 支持传入文字 或者 render函数; 文字使用el-tooltip渲染，render函数使用 el-dialog 渲染
 * @property {} formItemProps 此属性会作为 el-formItem 的props传入其中
 * @property {} formCompProps 此属性会作为 表单项(如el-input el-radio) 的props传入其中
 * @property {} defaultValue 默认的props值，可以不写。会自动从vue文件的props - default中取。值为函数时会传入当前的prop值作为参数
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
 * @property {} custom 是否为自定义渲染，固定传true值
 * @property {} componentPath 相对当前文件的自定义编辑组件路径，以 -editor.vue 结尾，否则会被当作正常组件读取
 * @property {} component （开发组件时不要填写此值）自定义编辑组件对象，由getComponents方法自动获取。
 */
export interface CustomEditor extends FormItem {
  custom: boolean
  componentPath: string
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
