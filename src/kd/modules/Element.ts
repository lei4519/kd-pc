import { EditorSection } from '../types/editor-props'
import { genUUID } from '../utils'
/**
 * @description 一行 el-row
 * @class Row
 * @param elements 一行内的组件，被el-col包裹
 */
export class Row {
  readonly id = genUUID()
  private MAX_SPAN = 24
  elements: ColElement[] = []
  get span() {
    return (
      this.MAX_SPAN -
      this.elements.reduce((span, { minSpan }) => span + minSpan, 0)
    )
  }
  constructor(row: Omit<Row, 'id' | 'MAX_SPAN' | 'span'>) {
    this.elements = row.elements.map(e => new ColElement(e))
  }
}
/**
 * @description 组件，不需要手动new实例。getComponents方法会读取组件目录自动创建
 * @class ColElement
 * @param name 组件name
 * @param zhName 组件中文名称，用于展示
 * @param minSpan 组件最小span，el-col span
 * @param path 组件路径
 * @param props 组件的props，组件配置区写入属性的地方
 * @param editorProps 生成组件配置区的配置描述
 */
export class ColElement {
  readonly id = genUUID()
  readonly type = 'element'
  name: string
  zhName: string
  minSpan: number
  path: string
  props: object
  editorProps: EditorSection[]
  constructor(element: Omit<ColElement, 'type' | 'id'>) {
    this.name = element.name
    this.zhName = element.zhName
    this.minSpan = element.minSpan || 1
    this.path = element.path
    this.props = element.props
    this.editorProps = element.editorProps
  }
}
