import { EditorSection } from '../types/editor-props'
import { genUUID } from '../utils'
import { cloneDeep } from 'lodash'
import { pathToComp } from '@/kd/utils/getComponents'
import { Page } from './Page'
import Vue from 'vue'

export interface RowProps {
  style?: Partial<CSSStyleDeclaration>
  elements: ColElementProp[]
}
/**
 * @description 装饰类方法 调用时开启脏检查
 */
function editDirty(methods: string[]) {
  return function(target: Function) {
    methods.forEach(method => {
      const origin = target.prototype[method]
      target.prototype[method] = function(...args: any[]) {
        this.dirty = true
        return origin.call(this, ...args)
      }
    })
  }
}
/**
 * @description 一行 el-row
 * @class Row
 * @param elements 一行内的组件，被el-col包裹
 * @param style 行样式
 * @param freeSpace 每行剩余空间 计算minSpan
 */
@editDirty(['addElements', 'delElement'])
export class Row {
  readonly id = genUUID()
  private MAX_SPAN = 24
  private freeSpace = 24
  private dirty = true
  parent?: Page
  style: Partial<CSSStyleDeclaration>
  elements: ColElement[] = []
  constructor(row: RowProps) {
    this.style = row.style || {
      marginBottom: '16px'
    }
    row.elements && this.addElements(row.elements)
  }
  getFreeSpace() {
    if (this.dirty) {
      this.dirty = false
      this.freeSpace =
        this.MAX_SPAN -
        this.elements.reduce((span, { minSpan }) => span + minSpan, 0)
    }
    return this.freeSpace
  }
  addElements(elements: ColElementProp | ColElementProp[]) {
    if (!Array.isArray(elements)) elements = [elements]
    return elements.map(element => {
      const colEl = new ColElement(element)
      colEl.parent = this
      this.elements.push(colEl)
      return colEl
    })
  }
  delElement(element: ColElement) {
    const page = this.parent!
    let elements = this.elements
    elements.splice(elements.findIndex(e => e.id === element.id)!, 1)
    // 删除后再取值
    let len = this.elements.length

    if (len === 0) {
      const delIdx = page.delRow(this)
       // 页面已经没有任何元素了
      if (delIdx === 0) return page.setEditingElement(null)
      // 上一行的元素
      elements = page.rows[delIdx - 1].elements 
      len = elements.length
    }
    page.setEditingElement(elements[len - 1])
  }
  setStyle(style: Partial<CSSStyleDeclaration>) {
    Object.entries(style).forEach(([key, val]) => {
      this.style[key as any] = val as any
    })
  }
  getStyle() {
    return {
      ...this.style,
      display: 'flex',
      flexWrap: 'wrap'
    }
  }
  toJSON() {
    return { ...this, parent: void 0 }
  }
}

export interface ColElementProp {
  name?: string
  zhName?: string
  minSpan?: number
  maxSpan?: number
  iconClass?: string
  path: string
  props: any
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
let componentID = 0
export class ColElement {
  readonly id = genUUID()
  readonly type = 'element'
  parent?: Row
  name: string
  zhName: string
  minSpan: number
  maxSpan: number
  iconClass: string
  path: string
  props: any
  constructor(element: ColElementProp) {
    this.name = element.name || 'component_' + componentID++
    this.zhName = element.zhName || '未命名'
    this.iconClass = element.iconClass || 'zujianicon'
    this.minSpan = element.minSpan || 1
    this.maxSpan = element.maxSpan || 24
    this.path = element.path
    this.props = cloneDeep(element.props)
  }
  getEditorProps(): EditorSection[] {
    return cloneDeep([...pathToComp[this.path].editorProps])
  }
  setProps(props: object) {
    Object.entries(props).forEach(([key, val]) => {
      // FIXME Vue3 响应式
      // this.props[key] = val
      Vue.set(this.props, key, val)
    })
  }
  getStyle() {
    return {
      flex: 1,
      transition: 'all .3s',
      minWidth: `${this.minSpan / 24 * 100}%`,
      maxWidth: `${this.maxSpan / 24 * 100}%`,
    }
  }
  toJSON() {
    return { ...this, parent: void 0 }
  }
}
