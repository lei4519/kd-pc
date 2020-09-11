import { EditorMutations } from './types'

export const mutations: EditorMutations = {
  SET_PROJECT(state, project) {
    state.project = project
  }
}
