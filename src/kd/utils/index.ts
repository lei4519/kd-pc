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
