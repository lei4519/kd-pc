import { CreateElement, RenderContext } from 'vue'

type On = { [key: string]: Function | Function[] }
function createCatch(events: Array<keyof WindowEventMap>): On {
  return events.reduce((res, event) => {
    res[`!${event}`] = (e: Event) => (e.preventDefault(), false)
    return res
  }, {} as On)
}
const on = createCatch(['keydown', 'click'])
/**
 * @desc 捕获事件，包裹在组件上，防止组件在编辑中被操作。
 */
export const CatchEvents = {
  name: 'CatchEvents',
  functional: true,
  render(c: CreateElement, { data, children, listeners }: RenderContext) {
    return c(
      'div',
      {
        ...data,
        staticStyle: {
          ...(data.staticStyle || {}),
          position: 'relative',
          zIndex: 9999
        },
        style: data.style || {},
        on: {
          ...on,
          ...listeners
        }
      },
      children
    )
  }
}
