// FIXME 改為TS
// @ts-nocheck
import { Message } from 'element-ui'
class LoadManage {
  constructor() {
    this.onceList = new Set()
    this.loadMap = new Map()
    this.loadingList = new Set()
  }
  add(getDataFn, callback, once) {
    if (!this.loadMap.has(getDataFn)) {
      this.loadMap.set(getDataFn, new Set())
    }
    if (once) {
      this.onceList.add(getDataFn)
    }
    this.loadMap.get(getDataFn).add(callback)
    return this
  }
  del(getDataFn, callback) {
    this.loadMap.get(getDataFn)?.delete(callback)
    if (this.loadMap.get(getDataFn)?.size === 0) {
      this.remove(getDataFn)
    }
  }
  remove(getDataFn) {
    if (this.loadMap.has(getDataFn)) {
      this.loadMap.delete(getDataFn)
    }
    return this
  }
  run(getDataFn, status) {
    const ajaxLoadingHandlers = this.loadMap.get(getDataFn)
    if (ajaxLoadingHandlers) {
      ajaxLoadingHandlers.forEach(fn => fn(status))
    }
    this.loadingList.delete(getDataFn)
  }
  _exec(getDataFn) {
    if (this.loadingList.has(getDataFn)) return
    this.loadingList.add(getDataFn)
    this.run(getDataFn, 'open')
    const getDataPromise = getDataFn()
    if (!getDataPromise.then) {
      this.run(getDataFn, 'close')
      return console.error('ajax-loading组件的getData函数，返回值必须为promise')
    }
    return getDataPromise.then((res) => {
      this.run(getDataFn, 'close')
      return res
    }).catch(err => {
      console.error(err)
      if (err?.msg) {
        Message({
          message: err.msg,
          type: 'error'
        })
      }
      this.run(getDataFn, 'error')
      return Promise.reject(err)
    }).finally(() => {
      if (this.onceList.has(getDataFn)) {
        this.onceList.delete(getDataFn)
        this.remove(getDataFn)
      }
    })
  }
  exec(getDataFn) {
    if (getDataFn === void 0) {
      this.loadMap.forEach((_, fn) => this._exec(fn))
    } else if (Array.isArray(getDataFn)) {
      getDataFn.forEach(fn => this._exec(fn))
    } else {
      return this._exec(getDataFn)
    }
  }
}
export function registerLoadManage(Vue) {
  Vue.prototype.$loadManage = new LoadManage()
}
