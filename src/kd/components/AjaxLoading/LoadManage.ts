type GetDataFn = (...args: any[]) => Promise<any>
type Status = 'open' | 'close' | 'error'
type ExecEffectFn = (status: Status) => void
/**
 * @description 请求loading 状态管理 全局类
 */
export class LoadManage {
  // 记录once 函数，只执行一次
  private execOnceList = new Set<GetDataFn>()
  // 存入正在执行中的函数 避免重复执行
  private execingList = new Set<GetDataFn>()
  // 管理请求函数 和 loading状态变化函数 的对应关系
  private loadMap = new Map<GetDataFn, Set<ExecEffectFn>>()
  addEffect(
    getDataFn: GetDataFn,
    execEffect: ExecEffectFn,
    once: boolean
  ): this {
    if (once) {
      this.execOnceList.add(getDataFn)
    }
    if (!this.loadMap.has(getDataFn)) {
      this.loadMap.set(getDataFn, new Set())
    }
    this.loadMap.get(getDataFn)!.add(execEffect)
    return this
  }
  delEffect(getDataFn: GetDataFn, execEffect: ExecEffectFn) {
    this.loadMap.get(getDataFn)?.delete(execEffect)
    if (this.loadMap.get(getDataFn)?.size === 0) {
      this.clearEffect(getDataFn)
    }
  }
  private clearEffect(getDataFn: GetDataFn): this {
    if (this.loadMap.has(getDataFn)) {
      this.loadMap.delete(getDataFn)
    }
    return this
  }
  private runEffect(status: Status, getDataFn: GetDataFn) {
    const execEffects = this.loadMap.get(getDataFn)
    if (execEffects) {
      execEffects.forEach(fn => fn(status))
    }
    if (status === 'close') {
      this.execingList.delete(getDataFn)
      if (this.execOnceList.has(getDataFn)) {
        this.execOnceList.delete(getDataFn)
        this.clearEffect(getDataFn)
      }
    } else if (status === 'error') {
      this.execingList.delete(getDataFn)
    }
  }
  private _exec(getDataFn: GetDataFn) {
    if (this.execingList.has(getDataFn)) return
    this.runEffect('open', getDataFn)
    const getDataPromise = getDataFn()
    if (!getDataPromise.then) {
      this.runEffect('close', getDataFn)
      return console.error('ajax-loading组件的getData函数，返回值必须为promise')
    }
    this.execingList.add(getDataFn)
    return getDataPromise
      .then(res => {
        this.runEffect('close', getDataFn)
        return res
      })
      .catch(err => {
        this.runEffect('error', getDataFn)
        return Promise.reject(err)
      })
  }
  exec(getDataFn: GetDataFn | GetDataFn[] | undefined) {
    if (getDataFn === void 0) {
      // 不传值 所有请求函数全部执行
      this.loadMap.forEach((_, fn) => this._exec(fn))
    } else if (Array.isArray(getDataFn)) {
      // 数组 只执行传入的数组函数
      getDataFn.forEach(fn => this._exec(fn))
    } else {
      // 单个函数 只执行当前函数
      return this._exec(getDataFn)
    }
  }
}
export const $loadManage = new LoadManage()
