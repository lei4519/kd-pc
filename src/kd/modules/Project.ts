import { Menu, MenuProps } from './Menu'
import { genUUID } from '../utils'
import { Theme } from './Theme'

export interface ProjectProps {
  name?: string
  logo?: string
  expire?: string
  menu?: MenuProps[]
  themeColor?: string
}
/**
 * @description 描述一个项目
 * @class Project
 * @property {} name 项目名称
 * @property {} logo 项目logo
 * @property {} expire 到期时间
 * @property {} menu 项目目录
 */
export class Project extends Theme implements ProjectProps {
  readonly id = genUUID()
  name: string
  logo: string
  expire: string
  menu: Menu[] = []
  constructor(project: ProjectProps) {
    super(project.themeColor || '#409EFF')
    this.name = project.name || ''
    this.logo = project.logo || ''
    this.expire = project.expire || ''
    project.menu && this.addMenu(project.menu)
  }
  addMenu(menu: MenuProps | MenuProps[]) {
    if (!Array.isArray(menu)) {
      menu = [menu]
    }
    this.menu.push(...menu.map(m => new Menu(m)))
  }
  delMenu(menu: Menu) {
    this.menu.splice(
      this.menu.findIndex(m => m === menu),
      1
    )
  }
}
