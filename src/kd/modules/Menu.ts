import { Page, PageProps } from './Page'
import { genUUID } from '../utils'
export type Children = Menu | Page
export type ChildrenProps = MenuProps | PageProps

let id = 0
export interface MenuProps {
  type: string
  name: string
  show: boolean
  edit?: boolean
  children: ChildrenProps[]
}
/**
 * @description 目录
 * @class Menu
 * @property {} name 目录名称
 * @property {} show 目录是否展示（权限管理）
 * @property {} edit 目录是否处于编辑模式
 * @property {} children 目录下的子目录、子页面数组
 */
export class Menu implements MenuProps {
  readonly id = genUUID()
  readonly type = 'menu'
  readonly routeID = 'menu_' + id++
  parent?: Menu
  name = ''
  show = true
  edit = false
  children: Children[] = []
  constructor(menu: MenuProps) {
    this.name = menu.name
    this.show = menu.show
    this.edit = menu.edit || false
    menu.children && this.addChild(menu.children)
  }
  // 添加子节点
  addChild(child: ChildrenProps | ChildrenProps[]) {
    if (!Array.isArray(child)) {
      child = [child]
    }
    child.forEach(c => {
      const isMenu = (t: ChildrenProps): t is Menu => t.type === 'menu'
      const child = isMenu(c) ? new Menu(c) : new Page(c)
      child.parent = this
      this.children.push(child)
    })
  }
  // 删除子节点
  delChild(child: Children) {
    this.children.splice(
      this.children.findIndex(c => c === child),
      1
    )
  }
  // 自删除
  remove() {
    this.parent?.delChild(this)
  }
  toJSON() {
    return { ...this, parent: void 0 }
  }
}
