import { Menu } from './Menu'
import { Row, RowProps, ColElement } from './Element'
let id = 0
interface Permission {
  name: string
  show: boolean
}
export interface PageProps {
  type: string
  name: string
  show: boolean
  edit?: boolean
  rows?: RowProps[]
  permissions?: Permission[]
  routeName?: string
}
/**
 * @description 页面布局信息
 * @property {} counter 记录每个组件在当前页面的数量
 * @property {} layouts 二维数组，记录每行里具体存放的组件名称
 * @property {} dropRowIndx 放下元素所在的行数
 */
export interface LayoutInfo {
  counter: { [cName: string]: number }
  layouts: string[][]
  dropRowIndx: number
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
  name = ''
  show = true
  edit = false
  rows: Row[] = []
  permissions?: Permission[] = []
  constructor(page: PageProps) {
    this.name = page.name
    this.show = page.show
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
    const formElements = this.rows[formRowIndex].elements
    const toElements = this.rows[toRowIndex].elements
    // 同行不需要等待动画过渡
    if (formRowIndex === toRowIndex) {
      const toEl: ColElement = toElements[toColIndex]
      const formEl: ColElement = formElements.splice(formColIndex, 1, toEl)[0]
      toElements.splice(toColIndex, 1, formEl)
    } else {
      const formEl: ColElement = formElements.splice(formColIndex, 1)[0]
      const toEl: ColElement = toElements.splice(toColIndex, 1)[0]
      setTimeout(() => {
        formElements.splice(formColIndex, 0, toEl)
        toElements.splice(toColIndex, 0, formEl)
        // FIXME css 动画变量
      }, 300)
    }
  }
  getLayout(dropRowIndx: number) {
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
        dropRowIndx
      } as LayoutInfo
    )
  }
  remove() {
    this.parent?.delChild(this)
  }
  setEditingElement(el: ColElement | null) {
    this.editingElement = el
  }
  toJSON() {
    return { ...this, editingElement: null, parent: void 0 }
  }
}
