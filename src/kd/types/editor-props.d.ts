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

/**
 * @description 通用配置
 * @param label el-formItem label
 * @param prop 要修改的props值
 * @param formItemProps 此属性会作为 el-formItem 的props传入其中
 * @param formCompProps 此属性会作为 表单项 的props传入其中
 * @param defaultValue 默认的props值，可以不写。会自动从vue文件的props - default中取
 * @param formatValue 写入props前触发，可以对值进行操作
 */
interface FormItem {
  label?: string
  prop: string
  formItemProps?: object
  formCompProps?: object
  defaultValue?: any
  formatValue?: (val: any) => void
}
/**
 * @description 自定义渲染配置
 * @param custom 是否为自定义渲染，固定传true值
 * @param component 相对当前文件的组件路径，以 -editor.vue 结尾，否则会被当作正常组件读取。或者直接传入组件（不建议，会加大不必要的打包体积）
 */
export interface CustomEditor extends FormItem {
  custom: boolean
  component?: Vue.ComponentOptions | string
}

interface Input extends FormItem {
  type: 'input'
}
interface InputNumber extends FormItem {
  type: 'inputNumber'
}

interface Switch extends FormItem {
  type: 'switch'
}
interface Slider extends FormItem {
  type: 'slider'
}
interface Select extends FormItem {
  type: 'select'
  options: {
    label: string
    value: string
  }[]
}
interface Radio extends FormItem {
  type: 'radio'
  options: {
    label: string
    value: string
  }[]
}
