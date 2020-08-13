// import { cloneDeep } from 'lodash'
// import undoRedoHistory from './History'
// import { RootStore } from '../..'

// const recordHistoryMutationTypes = new Set([
//   'editor/SET_EDITING_PAGE', // 作为初始状态
//   'editor/SET_EDITING_ELEMENT',
//   'editor/SET_EDITOR_STATE',
//   'editor/DEL_EDITING_ELEMENT',
// ])

// const undoRedoPlugin = (store: RootStore) => {
//   undoRedoHistory.init(store)

//   store.subscribe((mutation, state) => {
//     // 下一 Event Loop执行，避免阻塞
//     setTimeout(() => {
//       const { type } = mutation
//       if (recordHistoryMutationTypes.has(type)) {
//         undoRedoHistory.addState(cloneDeep(state))
//       }
//     })
//   })
// }

// export default undoRedoPlugin
