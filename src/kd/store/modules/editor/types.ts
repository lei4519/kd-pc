import { Project } from '@/kd/modules/Project'
import { UndoRedoHistory } from '@/kd/modules/History'

export interface EditorState {
  project: Project | null
  undoRedoHistory: UndoRedoHistory
}

export interface EditorMutations {
  SET_PROJECT: (state: EditorState, payload: Project | null) => void
  [key: string]: any
}
