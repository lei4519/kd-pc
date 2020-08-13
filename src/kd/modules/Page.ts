import { Menu } from './Menu'
import { Row, RowProps } from './Element'
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
 * @description 页面
 * @class Page
 * @param name 页面名称
 * @param show 是否展示（权限管理）
 * @param edit 编辑模式
 * @param rows 编辑区（一个页面中多行）
 * @param permissions 页面权限
 */
export class Page implements PageProps {
  readonly type = 'page'
  readonly routeID = 'page_' + id++
  parent?: Menu
  routeName?: string
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
  addRows(rows: RowProps | RowProps[]) {
    if (!Array.isArray(rows)) rows = [rows]
    rows.forEach(r => {
      this.rows.push(new Row(r))
    })
  }
  remove() {
    this.parent?.delChild(this)
  }
  toJSON() {
    return { ...this, parent: void 0 }
  }
}
