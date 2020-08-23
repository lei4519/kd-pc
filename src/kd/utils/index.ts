import { v4 as uuidv4 } from 'uuid'
/**
 * @description 生成唯一的uuid
 */
export function genUUID(): string {
  return uuidv4()
}

/* eslint-disable */
export function noop() {}

/**
 * @description 创建只读对象
 */
export function readonly(obj: object, tips?: string) {
  if (window.Proxy) {
    return new Proxy(obj, {
      set() {
        throw new Error(tips || '只读对象不可进行赋值操作！')
      }
    })
  } else {
    return Object.freeze(Object.create(obj))
  }
}
/**
 * @description 执行一次dom监听后，自动解除监听
 */
export function onceEventListener<K extends keyof HTMLElementEventMap>(
  dom: HTMLElement,
  eventName: K,
  callback: (ev: HTMLElementEventMap[K]) => any
) {
  const handler: (
    this: HTMLElement,
    ev: HTMLElementEventMap[K]
  ) => any = function(ev) {
    callback.call(this, ev)
    dom.removeEventListener(eventName, handler)
  }
  dom.addEventListener(eventName, handler)
}
/**
 * @description 返回promise，超时后resolve promise
 * @param resolveData promise.resolve 的数据
 * @param timeout 超时时间
 */
export function setTimeoutResolve(resolveData: any, timeout: number = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resolveData)
    }, timeout)
  })
}
