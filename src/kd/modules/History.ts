import { cloneDeep } from 'lodash'

class UndoRedoHistory {
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
    const prevState = this.history[--this.currentIndex]
    this.emit(cloneDeep(prevState))
  }

  redo() {
    if (!this.canRedo) return
    const nextState = this.history[++this.currentIndex]
    this.emit(cloneDeep(nextState))
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

export default UndoRedoHistory
