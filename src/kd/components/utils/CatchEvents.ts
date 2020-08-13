import { CreateElement, RenderContext } from 'vue'

type On = { [key: string]: Function | Function[] }
function createCatch(events: Array<keyof WindowEventMap>): On {
  return events.reduce((res, event) => {
    res[`!${event}`] = (e: Event) => (e.preventDefault(), false)
    return res
  }, {} as On)
}
const on = createCatch(['keydown', 'mousedown'])
/**
 * @desc 捕获事件，包裹在组件上，防止组件在编辑中被操作。
 */
export const CatchEvents = {
  functional: true,
  render(c: CreateElement, ctx: RenderContext) {
    return c(
      'div',
      {
        class: ctx.data.class || {},
        staticClass: ctx.data.staticClass || '',
        staticStyle: {
          ...(ctx.data.staticStyle || {}),
          height: '100%',
          width: '100%'
        },
        style: ctx.data.style || {},
        on
      },
      ctx.children
    )
  }
}
