import { noop } from '.'
import { ColElement } from '../modules/Element'
import { EditorSection, CustomEditor, Type } from '../types/editor-props'
/**
 * @description 目录
 */
export interface Dir {
  type: 'dir'
  name: string
  dirName: string
  children: ComponentList
}
export type ComponentList = Array<Dir | ColElement>

interface Path2Dir {
  [key: string]: Dir
}
/**
 * @description 读取组件目录，生成组件列表。
 * @description 目录可以在 dir.js 中导出 dirName 来给目录配置中文名称。
 * @description -editot.vue 结尾的文件视为组件配置区组件，不会出现在组件列表中。
 * @description . 开头的组件不会被解析。
 * @example 实例
 * - 目录   -| 文件
 * 目录结构
 * - form
 *   -| dir.js -> export const dirName = '表单类'
 *   -| FormItem.vue
 *   -| FormItem-editot.vue
 *   -| .extend.vue
 *
 * 输出
 * [
 *   {
 *      type: 'dir'
 *      name: 'form'
 *      dirName: '表单类'
 *      children: [
 *        {
 *          name: 'FormItem',
 *          zhName: '表单组件',
 *          minSpan: 4,
 *          path: './form/FormItem.vue',
 *          props: {},
 *          editorProps: FormItem-editot.vue 文件导出的组件对象
 *        }
 *      ]
 *   }
 * ]
 */

export function getComponents() {
  const modules = require.context('@/pc/components', true, /(dir\.js)|\.vue$/)
  return createComponentList(modules)
}

type RC = __WebpackModuleApi.RequireContext
function createComponentList(modules: RC): ComponentList {
  const path2dir: Path2Dir = {}
  return modules.keys().reduce((compInfo, item) => {
    // 以 . 开头的文件不予处理
    if (/\/\.(.*?)\.vue$/.test(item)) return compInfo
    // -editor.vue文件 由getEditorProps 函数处理
    if (/-editor\.vue$/.test(item)) return compInfo
    let res = compInfo
    const paths = item.split('/').slice(1)
    paths.forEach((name, i) => {
      if (name.includes('.')) {
        // 文件
        const path = paths.slice(0, i).join('/')
        if (name === 'dir.js') {
          const { dirName } = modules(item)
          path2dir[path].dirName = dirName
        } else {
          const ctor = modules(item).default
          addMap(`${path}/${name}`, ctor)
          // {} || Vue.extend({})
          const options = typeof ctor === 'function' ? ctor.options : ctor
          const {
            name: compName,
            zhName,
            editorProps = noop,
            props,
            minSpan = 4
          } = options
          res.push(
            new ColElement({
              name: compName,
              zhName,
              minSpan,
              path: `${path}/${name}`,
              props: getDefaultProps(props),
              editorProps: getEditorProps(editorProps(), path, modules)
            })
          )
        }
      } else {
        // 目录
        const path = paths.slice(0, i + 1).join('/')
        let dir = path2dir[path]
        if (!dir) {
          dir = {
            type: 'dir',
            name,
            dirName: '',
            children: []
          }
          res.push(dir)
          path2dir[path] = dir
        }
        res = dir.children
      }
    })
    return compInfo
  }, [] as ComponentList)
}
/**
 * @description 从 props中提取default值
 */
function getDefaultProps(props: object = {}): object {
  return Object.entries(props).reduce((res, [key, { default: defaultVal }]) => {
    if (!defaultVal) return res
    res[key] = typeof defaultVal === 'function' ? defaultVal() : defaultVal
    return res
  }, {} as any)
}

/**
 * @description 路径 -> 组件对象的映射表，编辑区渲染组件时使用
 */
export const pathToComp: any = {}
function addMap(comPath: string, ctor: any) {
  pathToComp[comPath] = ctor
}

/**
 * @description 获取配置区自定义渲染组件
 */
function getEditorProps(
  editorProps: EditorSection[],
  path: string,
  modules: RC
): EditorSection[] {
  if (!editorProps) return []
  const isCustom = (prop: Type): prop is CustomEditor =>
    (prop as CustomEditor).custom
  editorProps.forEach(section => {
    section.props.forEach(prop => {
      if (isCustom(prop) && typeof prop.component === 'string') {
        let componentPath = prop.component
        // 解析路径 ./ ../ ../../
        while (componentPath.startsWith('../')) {
          path = path.replace(/\/[A-Za-z0-9_-]+$/, '')
          componentPath = componentPath.replace('../', '')
        }
        if (componentPath.startsWith('./')) {
          componentPath = componentPath.replace('./', '')
        }
        const editCompPath = `./${path}/${componentPath}`
        prop.component = modules(editCompPath).default
      }
    })
  })
  return editorProps
}
