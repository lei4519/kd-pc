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
/**
 * @description 获取传入时间的相对时间，单位 天
 * @param dayNum 相对天数，正数代表相对时间之后的时间，负数代表相对时间之前的时间
 * @param date 相对时间
 * @returns [结果, 相对时间]
 */
export function getRelativeTime(dayNum = 0, date = new Date()) {
  const result = new Date(date)
  result.setTime(result.getTime() + 3600 * 1000 * 24 * dayNum)
  return [result, date]
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time: number, cFormat: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
