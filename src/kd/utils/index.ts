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
 * @description 通过proxy 代理只读对象
 */
export function readonly(obj: object, tips?: string) {
  return new Proxy(obj, {
    set() {
      throw new Error(tips || '只读对象不可进行赋值操作！')
    }
  })
}
