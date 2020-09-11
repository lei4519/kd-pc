import { EditorState } from './types'
import undoRedoHistory from '@/kd/modules/History'

export const state: EditorState = {
  project: null,
  undoRedoHistory
}
