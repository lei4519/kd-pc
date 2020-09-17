import axios from 'axios'
import jsonp from 'jsonp'
import qs from 'qs'
import { Message } from 'element-ui'

const instance = axios.create()
instance.jsonp = function({ url, params = {} }: { url: string; params: any }) {
  return new Promise((resolve, reject) => {
    const query = qs.stringify(params)
    if (query) {
      url += url.includes('?') ? `&${query}` : `?${query}`
    }
    jsonp(url, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
// 处理 请求格式 URLSearchParams FormData
instance.interceptors.request.use(config => {
  if (config.formData) {
    config.data = Object.entries(config.formData).reduce((form, [key, val]) => {
      if (Array.isArray(val)) {
        val.forEach(v =>
          form.append(`${key}[]`, typeof v === 'object' ? JSON.stringify(v) : v)
        )
      } else {
        form.append(key, typeof val === 'object' ? JSON.stringify(val) : val)
      }
      return form
    }, new FormData())
  }
  if (config.urlSearchParams) {
    config.data = Object.entries(config.urlSearchParams).reduce(
      (form, [key, val]) => (
        form.append(key, typeof val === 'object' ? JSON.stringify(val) : val),
        form
      ),
      new URLSearchParams()
    )
  }
  return config
})

instance.interceptors.response.use(
  value => {
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
