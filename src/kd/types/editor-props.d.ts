/**
 * @description 返回组件的配置项描述
 * @property {} props 传入组件的props对象，可以根据props的变化来返回不同的配置项
 * @waring 传入的props对象没有setter 只能读取值，不能修改值。
 */
export type EditorProps = (props: any) => EditorSection[]
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
  | ColorPicker
  | UploadImg
  | SelectInput
/**
 * @description Render 函数辅助类型
 */
type RenderExpand = (createElement: CreateElement, props: any) => VNode
/**
 * @description 通用配置
 * @property {} label el-formItem label
 * @property {} prop 要修改的props值，可以传入props路径来对数组、对象属性进行修改
 * @example prop: 'array.1' | 'object.src' | 'src'
 * @property {} onChange 上方 prop 值变化时调用，传入（setProps函数，改变的值, 传入组件的props值（只读）, 当前修改的prop），setProps调用需要传入prop路径和值 ，可以通过setProps改变自身值(number 改成 string )或别的prop值。
 * @example onChange(setProps, value) { setProps('object.1', {}) | setProps('src', 'img.jpg') }
 * @property {} tips 属性相关提示 支持传入文字 或者 render函数; 文字使用el-tooltip渲染，render函数使用 el-dialog 渲染
 * @property {} formItemProps 此属性会作为 el-formItem 的props传入其中
 * @property {} formCompProps 此属性会作为 表单项(如el-input el-radio) 的props传入其中
 * @property {} defaultValue 组件书写时不需要指定此值，会从props的default属性上读取。快搭系统在修改组件的非props值（如样式）时会用到。
 */
interface FormItem {
  label?: string
  prop: string
  onChange?: (
    setProps: (prop: string, value: any) => void,
    value: any,
    props: any,
    prop: any
  ) => void
  tips?:
    | ((createElement: CreateElement, hack: RenderContext<Props>) => VNode)
    | string
  formItemProps?: object
  formCompProps?: object
  defaultValue?: any
}
/**
 * @description 渲染el-option，配合el-select el-radio等需要选项的组件使用
 * @property {} options 渲染选项的列表配置
 * @property {} options.label 每一项的label
 * @property {} options.value 每一项的value
 * @property {} options.props 传给el-option的props
 */
interface Options {
  options: {
    label: string
    value: any
    props?: any
  }[]
}
/**
 * @description 自定义渲染配置
 * @property {} componentPath 相对当前文件的自定义编辑组件路径，以 -editor.vue 结尾，否则会被当作正常组件读取
 * @property {} component （开发组件时不要填写此值）自定义编辑组件对象，由getComponents方法自动获取。
 */
export interface CustomEditor extends FormItem {
  type: 'customEditor'
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
interface Select extends FormItem, Options {
  type: 'select'
}
/**
 * @description 单选框
 */
interface Radio extends FormItem, Options {
  type: 'radio'
}
/**
 * @description 数据源选择
 */
interface DataSource extends FormItem {
  type: 'dataSource'
}
/**
 * @description 上传图片
 */
interface UploadImg extends FormItem {
  type: 'uploadImg'
}
/**
 * @description 颜色选择
 */
interface ColorPicker extends FormItem {
  type: 'colorPicker'
}
/**
 * @description 下拉框 + 输入框 （参考数据源的展现形式）
 * @property {} prop 不再使用，因为这一个组件会修改两个prop值
 * @property {} defaultValue 不再使用，因为这一个组件会修改两个值
 * @property {} selectProp el-select 要修改的prop值
 * @property {} inputProp el-input 的prop值
 * @property {} selectDefaultValue 组件开发时不需要指定此值。默认的el-select值
 * @property {} inputDefaultValue 组件开发时不需要指定此值。默认的el-input值
 * @property {} formCompProps.selectProps 传入el-select 的props
 * @property {} formCompProps.inputProps 传入el-input 的props
 * @property {} options el-select 的 el-options
 */
interface SelectInput extends FormItem, Options {
  type: 'selectInput'
  prop?: any
  defaultValue?: any
  selectProp: string
  inputProp: string
  selectDefaultValue?: any
  inputDefaultValue?: any
  formCompProps?: {
    selectProps?: any
    inputProps?: any
  }
}
