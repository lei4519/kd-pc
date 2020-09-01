import AsyncValidator from 'async-validator'
import { Menu } from './Menu'
import { Row, RowProps, ColElement } from './Element'
import { cloneDeep, get } from 'lodash'
import { Message } from 'element-ui'
let id = 0
/**
 * @description 页面布局信息
 * @property {} counter 记录每个组件在当前页面的数量
 * @property {} layouts 二维数组，记录每行里具体存放的组件名称
 * @property {} dropRowIndx 放下元素所在的行数
 */
export interface LayoutInfo {
  counter: { [cName: string]: number }
  layouts: string[][]
  rowIndex?: number
  colIndex?: number
}
interface Permission {
  name: string
  show: boolean
}
export interface PageProps {
  type: 'page'
  name?: string
  show?: boolean
  edit?: boolean
  rows?: RowProps[]
  permissions?: Permission[]
  routeName?: string
}
/**
 * @description 页面
 * @class Page
 * @property {} name 页面名称
 * @property {} show 是否展示（权限管理）
 * @property {} edit 编辑模式
 * @property {} rows 编辑区（一个页面中多行）
 * @property {} permissions 页面权限
 */
export class Page implements PageProps {
  readonly type = 'page'
  readonly routeID = 'page_' + id++
  parent?: Menu
  routeName?: string
  editingElement: ColElement | null = null
  name: string
  show: boolean
  edit: boolean
  rows: Row[] = []
  permissions?: Permission[] = []
  constructor(page: PageProps) {
    this.name = page.name || ''
    this.show = page.show || true
    this.edit = page.edit || false
    this.routeName = page.routeName || 'pageView' + id++
    page.rows && this.addRows(page.rows)
    page.permissions && this.addPermissions(page.permissions)
  }
  addPermissions(permission: Permission | Permission[]) {
    permission
    // ..
  }
  addRows(rows: RowProps | RowProps[]): Row[] {
    if (!Array.isArray(rows)) rows = [rows]
    return rows.map(r => {
      const row = new Row(r)
      row.parent = this
      this.rows.push(row)
      return row
    })
  }
  delRow(rows: Row): number {
    const i = this.rows.findIndex(r => r.id === rows.id)!
    this.rows.splice(i, 1)
    return i
  }
  swapElement(indexs: {
    formRowIndex: number
    formColIndex: number
    toRowIndex: number
    toColIndex: number
  }) {
    const { formRowIndex, formColIndex, toRowIndex, toColIndex } = indexs
    const formRow = this.rows[formRowIndex]
    const toRow = this.rows[toRowIndex]
    const toEl: ColElement = toRow.elements[toColIndex]
    // 同行使用splice进行动画过渡
    if (formRowIndex === toRowIndex) {
      const toEl: ColElement = toRow.elements[toColIndex]
      const formEl: ColElement = formRow.elements.splice(
        formColIndex,
        1,
        toEl
      )[0]
      toRow.elements.splice(toColIndex, 1, formEl)
    } else {
      // 跨行动画过渡页面会晃动，直接替换状态，不进行动画
      // 留存状态
      const formEl: ColElement = cloneDeep(formRow.elements[formColIndex])
      formRow.replaceElement(toEl, formRow.elements[formColIndex])
      toRow.replaceElement(formEl, toEl)
    }
  }
  getLayout(rowIndex?: number, colIndex?: number) {
    return this.rows.reduce(
      (res, row, i) => {
        res.layouts[i] = []
        row.elements.forEach(el => {
          if (!res.counter[el.name]) res.counter[el.name] = 0
          res.counter[el.name]++
          res.layouts[i].push(el.name)
        })
        return res
      },
      {
        counter: {},
        layouts: [],
        rowIndex,
        colIndex
      } as LayoutInfo
    )
  }
  addDropPlaceholder(element: ColElement) {
    this.rows.forEach(row => {
      const freeSpace = row.getFreeSpace()
      if (freeSpace && freeSpace >= element.minSpan) {
        row.addElements({
          name: 'dropPlaceholder',
          zhName: 'drop放置区',
          minSpan: 1,
          maxSpan: 24,
          iconClass: '',
          path: '',
          props: null
        })
      }
    })
    // 最后一行
    this.addRows({
      elements: [
        {
          name: 'dropPlaceholder',
          zhName: 'drop放置区',
          minSpan: 1,
          maxSpan: 24,
          iconClass: '',
          path: '',
          props: null
        }
      ]
    })
  }
  removeDropPlaceholder() {
    const { rows } = this
    rows.forEach(row => {
      row.delDropPlaceholder()
    })
    // 检查最后一行
    if (rows[rows.length - 1].elements.length === 0) {
      rows.pop()
    }
  }
  remove() {
    this.parent?.delChild(this)
  }
  setEditingElement(el: ColElement | null) {
    this.editingElement = el
  }
  async validate() {
    // 所有元素拍平成一个数组，方便遍历
    const elements = this.rows.map(row => row.elements).flat()
    if (!elements?.length) return Promise.resolve({ value: void 0, done: true })
    // 定义异步遍历器
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          i: 0,
          next() {
            if (this.i < elements.length) {
              const element = elements[this.i++]
              const editorProps = element.getEditorProps()
              // 记录 rules
              let descriptor: any = null
              // 记录 section 索引
              const sectionMap: any = {}
              // 从 editorProps 中取出 rules 规则
              editorProps.forEach((section, i) => {
                section.props.forEach(({ prop, formItemProps }) => {
                  if (formItemProps?.rules) {
                    if (!descriptor) descriptor = {}
                    descriptor[prop] = formItemProps?.rules
                    sectionMap[prop] = i
                  }
                })
              })
              if (descriptor) {
                const validator = new AsyncValidator(descriptor)
                const model: any = {}
                Object.keys(descriptor).forEach(prop => {
                  // 处理路径
                  model[prop] = get(element.props, prop)
                })
                return new Promise<{ value: any; done: boolean }>(
                  (resolve, reject) => {
                    validator.validate(
                      model,
                      { firstFields: true, first: true },
                      (errors, fields) => {
                        if (errors) {
                          const sectionIdx = sectionMap[Object.keys(fields)[0]]
                          return reject({ errors, fields, element, sectionIdx })
                        } else {
                          return resolve({ value: void 0, done: false })
                        }
                      }
                    )
                  }
                )
              }
              return Promise.resolve({ value: void 0, done: false })
            }
            return Promise.resolve({ value: void 0, done: true })
          }
        }
      }
    }
    try {
      for await (const num of asyncIterable) {
        // 校验通过
        num
      }
    } catch ({ errors: [{ message }], element, sectionIdx }) {
      Message.error(message)
      this.setEditingElement(element)
      // 表单渲染后打开 immediateValidate 标志
      setTimeout(() => {
        element.immediateValidate = {
          sectionIdx
        }
      })
      // watch 调用后关闭 immediateValidate 标志
      setTimeout(() => {
        element.immediateValidate = null
      })
      return Promise.reject()
    }
    return Promise.resolve()
  }
  toJSON() {
    return { ...this, editingElement: null, parent: void 0 }
  }
}
