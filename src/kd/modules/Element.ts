import { EditorSection } from '../types/editor-props'
import { genUUID } from '../utils'
import { cloneDeep, get } from 'lodash'
import { pathToComp } from '@/kd/utils/getComponents'
import { Page } from './Page'
import Vue, { Component } from 'vue'
import { componentPadding } from '@/kd/style/global-variable.scss'
export interface RowProps {
  style?: {
    [P in keyof Partial<CSSStyleDeclaration>]:
      | Partial<CSSStyleDeclaration>[P]
      | number
  }
  elements: ColElementProp[]
}
/**
 * @description 装饰类方法 调用时开启脏检查
 */
export function editDirty(methods: string[]) {
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
  style: {
    [P in keyof Partial<CSSStyleDeclaration>]:
      | Partial<CSSStyleDeclaration>[P]
      | number
  }
  elements: ColElement[] = []
  constructor(row: RowProps) {
    this.style = row.style || {
      marginBottom: 16
    }
    row.elements && this.addElements(row.elements)
  }
  remove() {
    return this.parent!.delRow(this)
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
    if (!component.disabled) {
      component.disabled = true
    }
    // 以下为聚焦其他节点逻辑
    // 删除后再取值
    let len = this.elements.length
    if (len === 0) {
      const delIdx = this.remove()
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
    //如果有其他单位需要处理的增加 「单位：['属性名']、px:['fontSize','width']
    const addUnit = {
      px: ['marginBottom']
    }
    const style: any = { ...this.style }
    Object.entries(addUnit).forEach(([unit, props]) => {
      props.forEach((prop: string) => {
        style[prop] = style[prop] + unit
      })
    })
    return {
      ...style,
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: `-${parseFloat(componentPadding) / 2}px`,
      marginRight: `-${parseFloat(componentPadding) / 2}px`
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
  needParentStyle?: boolean
  iconClass?: string
  path: string
  props: any
  style?: {
    [P in keyof Partial<CSSStyleDeclaration>]:
      | Partial<CSSStyleDeclaration>[P]
      | number
  }
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
 * @property {} disabled 是否禁用
 * @property {} needParentStyle 是否自动给元素加上阴影和 hover 边框样式
 * @property {} renderComponent 搭建页面中真实渲染的只读Vue组件实例，传给配置区取值使用
 * @property {} immediateValidate 配置区渲染后立即校验表单，配合 Page.validate 使用
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
  needParentStyle: boolean
  iconClass: string
  path: string
  props: any
  disabled = true
  style: {
    [P in keyof Partial<CSSStyleDeclaration>]:
      | Partial<CSSStyleDeclaration>[P]
      | number
  }
  renderComponent?: Component | null = null
  immediateValidate: { [key: string]: any } | null = null
  constructor(element: ColElementProp) {
    this.name = element.name || 'component_' + componentID++
    this.zhName = element.zhName || '未命名'
    this.needParentStyle = element.needParentStyle || true
    this.iconClass = element.iconClass || 'zujianicon'
    this.minSpan = element.minSpan || 1
    this.maxSpan = element.maxSpan || 24
    this.path = element.path
    this.style = cloneDeep(
      element.style || {
        fontSize: '',
        color: '',
        fontWeight: 'inherit',
        fontStyle: 'inherit',
        textAlign: 'left',
        fontFamily: 'inherit'
      }
    )
    this.props = cloneDeep(element.props)
  }
  getEditorProps(): EditorSection[] {
    const { editorProps, commonSetting } = pathToComp[this.path]
    const isTrue = (v: boolean) => v === true
    const common: EditorSection[] = [
      ...(isTrue(commonSetting.font)
        ? ([
            {
              title: '字体设置',
              props: [
                {
                  label: '字体颜色',
                  prop: 'style.color',
                  type: 'colorPicker',
                  defaultValue: this.style.color
                },
                {
                  label: '字体大小',
                  prop: 'style.fontSize',
                  type: 'inputNumber',
                  defaultValue: this.style.fontSize || 12
                },
                {
                  label: '字体',
                  prop: 'style.fontFamily',
                  type: 'select',
                  defaultValue: this.style.fontFamily,
                  options: [
                    {
                      label: '继承父级',
                      value: 'inherit'
                    },
                    {
                      label: '苹方',
                      value: 'PingFang SC'
                    },
                    {
                      label: '微软雅黑',
                      value: '微软雅黑'
                    },
                    {
                      label: 'Helvetica',
                      value: 'Helvetica'
                    },
                    {
                      label: 'STHeiti',
                      value: 'STHeiti'
                    },
                    {
                      label: 'Droidsansfallback',
                      value: 'Droidsansfallback'
                    }
                  ]
                },
                {
                  label: '对齐方式',
                  prop: 'style.textAlign',
                  type: 'select',
                  defaultValue: this.style.textAlign,
                  options: [
                    {
                      label: '左',
                      value: 'left'
                    },
                    {
                      label: '居中',
                      value: 'center'
                    },
                    {
                      label: '右',
                      value: 'right'
                    }
                  ]
                },
                {
                  label: '粗体',
                  prop: 'style.fontWeight',
                  type: 'switch',
                  formCompProps: {
                    activeValue: 'bold',
                    inactiveValue: 'inherit'
                  },
                  defaultValue: this.style.fontWeight
                },
                {
                  label: '斜体',
                  prop: 'style.fontStyle',
                  type: 'switch',
                  formCompProps: {
                    activeValue: 'italic',
                    inactiveValue: 'inherit'
                  },
                  defaultValue: this.style.fontStyle
                }
              ]
            }
          ] as EditorSection[])
        : [])
    ]

    return cloneDeep([
      ...editorProps.call(Object.create(this.renderComponent!)),
      ...common
    ])
  }
  setProps(props: object) {
    Object.entries(props).forEach(([props, value]) => {
      if (!props.startsWith('style.')) props = 'props.' + props
      const path = props.split('.')
      const key = path.pop()!
      const obj = get(this, path.join('.'), this)
      // FIXME Vue3 响应式
      // obj[key] = val
      Vue.set(obj, key, value)
    })
  }
  setRenderComponent(renderComponent: Component) {
    this.renderComponent = renderComponent
  }
  getStyle(): Partial<CSSStyleDeclaration> {
    //如果有其他单位需要处理的增加 「单位：['属性名']、px:['fontSize','width']
    const addUnit = {
      px: ['fontSize']
    }
    const style: any = { ...this.style }
    Object.entries(addUnit).forEach(([unit, props]) => {
      props.forEach((prop: string) => {
        style[prop] = style[prop] + unit
      })
    })
    return {
      flex: '1',
      minWidth: `${(this.minSpan / 24) * 100}%`,
      maxWidth: `${(this.maxSpan / 24) * 100}%`,
      padding: `0 ${parseFloat(componentPadding) / 2}px`,
      ...style
    }
  }
  toJSON() {
    return {
      ...this,
      parent: void 0,
      renderComponent: void 0,
      immediateValidate: void 0
    }
  }
}
