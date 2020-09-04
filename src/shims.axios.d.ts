import { AxiosRequestConfig } from 'axios'
import jsonp from 'jsonp'
declare module 'axios' {
  /**
   * @description 增加 jsonp 请求
   */
  export interface AxiosInstance {
    jsonp: <T extends any>({ url: string, params: any }) => Promise<T extends any>
  }
  /**
   * @param formData 自动处理成 FormData 格式
   */
  export interface AxiosRequestConfig {
    formData?: object
    urlSearchParams?: object
  }
}
