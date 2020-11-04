import { getToken, removeToken } from '@/kd/utils/auth'
// import { Message } from 'element-ui'
import { resetRouter } from '@/kd/router/utils'
import ajax from '@/kd/plugins/global-methods/axios'
import { ActionContext } from 'vuex'

interface State {
  token: string
  userInfo: any
}
interface Mutation {
  [key: string]: (state: State, payload: any) => any
}
interface Actions {
  [key: string]: (context: ActionContext<State, any>, payload: any) => void
}
export default {
  namespaced: true,
  state: {
    token: getToken().userId,
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  } as State,
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    }
  } as Mutation,
  actions: {
    // getUserInfo({ commit }) {
    //   // api.user.getUser().then(({ data }) => {
    //   //   localStorage.setItem('userInfo', JSON.stringify(data || {}))
    //   //   commit('SET_USER_INFO', data || {})
    //   // })
    // },
    login({ commit }, userInfo) {
      const { mobile, username, password, code, verifycode } = userInfo
      return ajax
        .jsonp({
          url: `${process.env.VUE_APP_LOGIN_API}/api/user/blogin`,
          params: {
            user_name: username.trim() || mobile,
            passwd: password,
            code,
            verifycode,
            appid: 30005
          }
        })
        .then(res => {
          if (res.code !== 1000) {
            return Promise.reject(res)
          }
          return res.data
        })
        .then(() => {
          commit(
            {
              type: 'project/SET_PROJECT'
            },
            {
              root: true
            }
          )
        })

      // .then(api.user.getPermissions)
      // .then(({ data }) => {
      //   dispatch('getUserInfo')
      //   dispatch('setRoutes', data)
      // })
    },
    logout({ dispatch, commit }) {
      const { userId, token, sessionId } = getToken()
      return ajax
        .jsonp({
          url: process.env.VUE_APP_LOGIN_API + '/api/sso/sso_logout',
          params: {
            user_id: userId,
            token,
            session_id: sessionId
          }
        })
        .then(() => {
          commit
          // commit('SET_USER_INFO', {})
          return dispatch('resetToken')
        })
    },
    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        localStorage.clear()
        resolve()
      })
    }
  } as Actions
}
