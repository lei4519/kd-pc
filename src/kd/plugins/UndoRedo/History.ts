// import { cloneDeep } from 'lodash'
// import { RootStore } from '../..'

// class UndoRedoHistory {
//     store: RootStore | null = null
//     history: any[] = []
//     currentIndex = -1

//     get canUndo () {
//       return this.currentIndex > 0
//     }

//     get canRedo () {
//       return this.history.length > this.currentIndex + 1
//     }

//     init (store: RootStore) {
//       this.store = store
//     }

//     addState (state: any) {
//       // 撤销后加入了新的操作
//       if (this.currentIndex + 1 < this.history.length) {
//         this.history.splice(this.currentIndex + 1)
//       }
//       this.history.push(state)
//       this.currentIndex++
//     }

//     undo () {
//       if (!this.canUndo) return
//       const prevState = this.history[--this.currentIndex]
//       this.store?.replaceState(cloneDeep(prevState))
//     }

//     redo () {
//       if (!this.canRedo) return
//       const nextState = this.history[++this.currentIndex]
//       this.store?.replaceState(cloneDeep(nextState))
//     }
// }

// const undoRedoHistory = new UndoRedoHistory()

// export default undoRedoHistory
