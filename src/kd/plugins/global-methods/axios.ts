import axios from 'axios'
import { Message } from 'element-ui'

const instance = axios.create()
// 处理 请求格式 URLSearchParams FormData
instance.interceptors.request.use(config => {
  if (config.formData) {
    config.data = Object.entries(config.formData).reduce((form, [key, val]) => {
      if (Array.isArray(val)) {
        val.forEach(v => form.append(`${key}[]`, v))
      } else {
        form.append(key, val)
      }
      return form
    }, new FormData())
  }
  if (config.urlSearchParams) {
    config.data = Object.entries(config.urlSearchParams).reduce(
      (form, [key, val]) => (form.append(key, val), form),
      new URLSearchParams()
    )
  }
  return config
})

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
