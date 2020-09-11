import { cloneDeep } from 'lodash'
import store from '@/kd/store'

export class UndoRedoHistory {
  history: any[] = []
  currentIndex = -1
  listeners: Set<Function> = new Set()
  get canUndo() {
    return this.currentIndex > 0
  }

  get canRedo() {
    return this.history.length > this.currentIndex + 1
  }

  addState(state: any) {
    // 撤销后加入了新的操作
    if (this.currentIndex + 1 < this.history.length) {
      this.history.splice(this.currentIndex + 1)
    }
    this.history.push(cloneDeep(state))
    this.currentIndex++
  }

  undo() {
    if (!this.canUndo) return
    const prevState = cloneDeep(this.history[--this.currentIndex])
    this.emit(prevState)
    store.commit('editor/SET_PROJECT', prevState)
  }

  redo() {
    if (!this.canRedo) return
    const nextState = cloneDeep(this.history[++this.currentIndex])
    this.emit(nextState)
    store.commit('editor/SET_PROJECT', nextState)
  }

  clear() {
    this.history = []
    this.currentIndex = -1
    this.listeners = new Set()
  }

  on(fn: Function) {
    this.listeners.add(fn)
  }

  off(fn: Function) {
    this.listeners.delete(fn)
  }

  emit(state: any) {
    this.listeners.forEach(fn => fn(state))
  }
}
const undoRedoHistory = ((window as any).undoRedoHistory = new UndoRedoHistory())
export default undoRedoHistory

let flag = true
const addState = () => {
  if (flag) {
    flag = false
    setTimeout(() => {
      flag = true
      undoRedoHistory.addState(store.state.editor.project)
    })
  }
}
export function addHistoryState(
  methods: Array<string | [string, (...args: any[]) => boolean]>
) {
  return function(target: Function) {
    methods.forEach((item: string | [string, (...args: any[]) => boolean]) => {
      let condition: Function | null = null
      let method = ''
      if (Array.isArray(item)) {
        condition = item[1]
        method = item[0]
      } else {
        method = item
      }
      const origin = target.prototype[method]
      target.prototype[method] = function(...args: any[]) {
        condition ? condition(...args) && addState() : addState()
        return origin.call(this, ...args)
      }
    })
  }
}
