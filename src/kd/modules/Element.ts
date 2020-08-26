import { EditorSection } from '../types/editor-props'
import { genUUID, readonly } from '../utils'
import { cloneDeep } from 'lodash'
import { pathToComp } from '@/kd/utils/getComponents'
import { Page } from './Page'
import Vue, { Component } from 'vue'

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
 * @property {} elements 一行内的组件，被el-col包裹
 * @property {} style 行样式
 * @property {} freeSpace 每行剩余空间 计算minSpan
 */
@editDirty([
  'addElements',
  'delElement',
  'replaceElement',
  'delDropPlaceholder'
])
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
  replaceElement(source: ColElement, target: ColElement) {
    Object.entries(source).forEach(([key, val]) => {
      if (key === 'id') return
      if (key === 'parent') return (target.parent = this)
      if (key === 'renderComponent') return
      ;(target as any)[key] = cloneDeep(val)
    })
    return target
  }
  replaceDropPlaceholder(element: ColElementProp) {
    const colEl = new ColElement(element)
    const placeholoader = this.elements[this.elements.length - 1]
    return this.replaceElement(colEl, placeholoader)
  }
  delDropPlaceholder() {
    const { elements } = this
    const { name } = elements[elements.length - 1]
    if (name === 'dropPlaceholder') {
      elements.pop()
    }
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
  delElement(element: ColElement, componentList: ColElement[]) {
    const page = this.parent!
    let elements = this.elements
    elements.splice(elements.findIndex(e => e.id === element.id)!, 1)
    const component = componentList.find(c => c.name === element.name)!
    if (!component.draggable) {
      component.draggable = true
    }
    // 以下为聚焦其他节点逻辑
    // 删除后再取值
    let len = this.elements.length
    if (len === 0) {
      const delIdx = page.delRow(this)
      const rowSize = page.rows.length
      // 页面已经没有任何元素了
      if (delIdx === 0 && rowSize === 0) return page.setEditingElement(null)
      // 如果删的是第一行 聚焦下一行 否则聚焦上一行
      elements = page.rows[delIdx === 0 ? 0 : delIdx - 1].elements
      len = elements.length
    }
    page.setEditingElement(elements[len - 1])
  }
  setStyle(style: Partial<CSSStyleDeclaration>) {
    Object.entries(style).forEach(([key, val]) => {
      this.style[key as any] = val as any
    })
  }
  getStyle(): Partial<CSSStyleDeclaration> {
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
 * @property {} parent 父级Row组件
 * @property {} name 组件name
 * @property {} zhName 组件中文名称，用于展示
 * @property {} minSpan 组件最小span，el-col span
 * @property {} maxSpan 组件最大span，el-col span
 * @property {} iconClass 组件展示图表类名 iconfont 类名
 * @property {} path 组件路径
 * @property {} props 组件的props，组件配置区写入属性的地方
 * @property {} draggable 是否可拖拽
 * @property {} renderComponent 搭建页面中真实渲染的只读Vue组件实例，传给配置区取值使用
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
  draggable = true
  renderComponent?: Component | null = null
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
    const commonSetting: EditorSection[] = [] || [
      {
        title: '通用设置',
        props: [
          {
            label: '加载模式',
            prop: 'ajaxLoadingMode',
            type: 'select',
            defaultValue: 'skeleton',
            options: [
              {
                label: 'loading',
                value: 'loading'
              },
              {
                label: '骨架屏',
                value: 'skeleton'
              }
            ]
          }
        ]
      }
    ]
    const com = pathToComp[this.path]
    return cloneDeep([
      ...commonSetting,
      ...com.editorProps.call(Object.create(this.renderComponent!))
    ])
  }
  setProps(props: object) {
    Object.entries(props).forEach(([key, val]) => {
      // FIXME Vue3 响应式
      // this.props[key] = val
      Vue.set(this.props, key, val)
    })
  }
  setRenderComponent(renderComponent: Component) {
    this.renderComponent = Object.create(renderComponent)
  }
  getStyle(): Partial<CSSStyleDeclaration> {
    return {
      flex: '1',
      minWidth: `${(this.minSpan / 24) * 100}%`,
      maxWidth: `${(this.maxSpan / 24) * 100}%`
    }
  }
  toJSON() {
    return { ...this, parent: void 0 }
  }
}
