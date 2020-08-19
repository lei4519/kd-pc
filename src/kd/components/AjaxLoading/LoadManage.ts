// FIXME 改為TS
// @ts-nocheck
class LoadManage {
  constructor() {
    this.execOnceList = new Set()
    this.loadMap = new Map()
    this.execingList = new Set()
  }
  add(getDataFn, callback, once) {
    if (!this.loadMap.has(getDataFn)) {
      this.loadMap.set(getDataFn, new Set())
    }
    if (once) {
      this.execOnceList.add(getDataFn)
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
  runEffect(status, getDataFn) {
    const execEffects = this.loadMap.get(getDataFn)
    if (execEffects) {
      execEffects.forEach(fn => fn(status))
    }
    if (status !== 'open') {
      this.execingList.delete(getDataFn)
      if (this.execOnceList.has(getDataFn)) {
        this.execOnceList.delete(getDataFn)
        this.remove(getDataFn)
      }
    }
  }
  _exec(getDataFn) {
    if (this.execingList.has(getDataFn)) return
    this.runEffect('open', getDataFn)
    const getDataPromise = getDataFn()
    if (!getDataPromise.then) {
      this.runEffect('close', getDataFn)
      return console.error('ajax-loading组件的getData函数，返回值必须为promise')
    }
    this.execingList.add(getDataFn)
    return getDataPromise.then((res) => {
      this.runEffect('close', getDataFn)
      return res
    }).catch(err => {
      this.runEffect('error', getDataFn)
      return Promise.reject(err)
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
