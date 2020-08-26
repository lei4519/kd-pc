/*
 * @Author: zijian6@leju.com
 * @Date: 2020-08-14 14:05:27
 * @LastEditors: zijian6@leju.com
 * @LastEditTime: 2020-08-24 14:00:32
 * @FilePath: /res.leju.com/dev/mvvm-project/vue/kd-pc/src/pc/utils/index.ts
 */
import { v4 as uuidv4 } from 'uuid'
export function genUUID(): string {
  return uuidv4()
}

/* eslint-disable */
export function noop() {}

// 柯里化
export const curry = (fn: any) => {
  const _curry = (args: Array<any> = []) => (...arg: Array<any>) =>
    args.length + arg.length >= fn.length
      ? fn(...args, ...arg)
      : _curry(args.concat(arg))
  return _curry()
}
// 获取属性
export const prop = curry((prop: string, obj: any) => obj[prop])
const isType = curry(function(type: string, val: any) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
})
export const isObject = isType('Object')

/**
 * @description 深层次merge对象属性
 * @example :
 * const o1 = {
 *    foo: 1,
 *    bar: {
 *      one: { a: 3 },
 *      two: 2
 *    }
 * }
 * deepMerge(o1, {
 *    foo: 2,
 *    foo1: 3,
 *    bar: {
 *      one: {
 *        b: 4
 *      },
 *      two: 3,
 *      five: 5
 *    }
 * })
 * output: {
 *    foo: 2, foo1: 3, bar: {one: {a: 3, b: 4}, two: 3, five: 5}
 * }
 */
export const deepMerge = (...args: Array<string>) => {
  const res = args.shift()
  const merge = (o1: any, o2: any) => {
    Object.keys(o2).forEach(key => {
      if (isObject(o2[key])) {
        if (!o1[key]) o1[key] = {}
        merge(o1[key], o2[key])
      } else {
        o1[key] = o2[key]
      }
    })
  }
  return args.reduce((res, obj) => {
    merge(res, obj)
    return res
  }, res)
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

