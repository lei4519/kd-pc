import { themeColor, duration } from '@/kd/style/global-variable.scss'

interface State {
  themeColor: string
  duration: number
}
interface Mutation {
  SET_STATE: (
    state: State,
    payload: {
      [key in keyof State]: any
    }
  ) => void
  [key: string]: any
}
const state: State = {
  themeColor,
  duration
}
const mutations: Mutation = {
  SET_STATE(state, payload) {
    Object.entries(payload).forEach(([key, val]) => {
      ;(state as any)[key] = val
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
