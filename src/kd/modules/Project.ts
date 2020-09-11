import { Menu, MenuProps } from './Menu'
import { genUUID } from '../utils'
import { Theme } from './Theme'
import { addHistoryState } from './History'

export interface ProjectProps {
  name?: string
  logo?: string
  expire?: string
  menu?: MenuProps[]
  themeColor?: string
  themeEl?: HTMLElement
}
/**
 * @description 描述一个项目
 * @class Project
 * @property {} name 项目名称
 * @property {} logo 项目logo
 * @property {} expire 到期时间
 * @property {} menu 项目目录
 */
@addHistoryState(['addMenu', 'delMenu'])
export class Project extends Theme implements ProjectProps {
  readonly id = genUUID()
  name: string
  logo: string
  expire: string
  menu: Menu[] = []
  constructor(project: ProjectProps) {
    super(project.themeColor || '#409EFF', project.themeEl)
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
