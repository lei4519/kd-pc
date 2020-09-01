import axios from 'axios'
import { Message } from 'element-ui'

const instance = axios.create()

instance.interceptors.response.use(
  value => {
    debugger
    return value
  },
  err => {
    const {
      response: { status, request }
    } = err
    if (status === 404) {
      Message.error({
        message: `接口地址不存在：${request.responseURL}`,
        duration: 5000
      })
      return Promise.reject(`接口地址不存在：${request.responseURL}`)
    }
    return Promise.reject(err)
  }
)

export default instance
