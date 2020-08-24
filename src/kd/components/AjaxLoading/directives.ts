import { DirectiveOptions } from 'vue'

/**
 * @description 骨架屏指令，配合ajax-loading组件使用
 * @info 实现原理：给指令元素添加css类名，请求开始时给css类名添加背景颜色和动画效果，请求结束去掉颜色和动画效果。
 * @param width 骨架元素宽度
 * @param height 骨架元素高度
 * @info 如果元素本身在没有数据的情况下就可以撑起宽高，则不需要再指定宽高。如果元素（文本元素等）在没有数据下无法在页面进行占位，则需要指定宽高。
 * @example
 * v-skeleton 元素可以撑起宽高
 * v-skeleton="{width: '100px'}" 指定宽度
 * v-skeleton="{height: '100px'}" 指定高度
 * v-skeleton="{width: '100px', height: '100px'}" 同时指定
 */
export const skeleton: DirectiveOptions = {
  bind(el, { value: { width, height } = {} }) {
    el.classList.add('ajax-loading-skeleton')
    width && el.style.setProperty('--skeleton-width', width)
    height && el.style.setProperty('--skeleton-height', height)
  }
}
