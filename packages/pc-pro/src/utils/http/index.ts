import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import type { HttpResponse, ResOptions } from '@/types'
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { useAuthStore, useRouterStore } from '@/store'

const { message, notification } = createDiscreteApi(['message', 'notification'])

// 扩展 AxiosRequestConfig 接口
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    needToken?: boolean
    needTip?: boolean
  }
}

/**
 * 解析请求错误
 */
function resolveResError(code: number | string, msg: string, needTip = true): string | false {
  let message = msg
  switch (code) {
    case 401:
      message = '登录已过期，请重新登录'
      break
    case 403:
      message = '请求被拒绝'
      break
    case 404:
      message = '请求资源或接口不存在'
      break
    case 500:
      message = '服务器发生异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  needTip && window.$message?.error(message)
  return message
}

/**
 * 创建标准 axios 实例
 */
export function createAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const defaultOptions: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_AXIOS_BASE_URL as string,
    timeout: 12000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      // 处理不需要token的请求
      if (config.needToken === false) {
        return config
      }

      const { accessToken } = useAuthStore()
      if (accessToken) {
        // token: Bearer + xxx
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const { data, status, config, statusText, headers } = response
      // 处理文件下载
      if (
        headers['content-type']?.includes('application/octet-stream') ||
        headers['content-type']?.includes('application/vnd.ms-excel') ||
        headers['content-type']?.includes(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ) {
        return Promise.resolve(response)
      }

      if (headers['content-type']?.includes('json')) {
        const SUCCESS_CODES = [0, 200]
        if (SUCCESS_CODES.includes((data as HttpResponse)?.code)) {
          return Promise.resolve(data)
        }
        const code = (data as HttpResponse)?.code ?? status
        const needTip = (config as any)?.needTip !== false
        const message = resolveResError(
          code,
          (data as HttpResponse)?.message ?? statusText,
          needTip
        )
        return Promise.reject({ code, message, error: data ?? response })
      }
      return Promise.resolve(data ?? response)
    },
    (error) => {
      if (!error || !error.response) {
        const code = error?.code
        const message = resolveResError(code as string, error.message as string)
        return Promise.reject({ code, message, error })
      }

      const { data, status, config } = error.response
      const code = (data as HttpResponse)?.code ?? status
      const needTip = (config as ResOptions)?.needTip !== false
      const message = resolveResError(
        code,
        (data as HttpResponse)?.message ?? error.message,
        needTip
      )
      return Promise.reject({ code, message, error: error.response?.data || error.response })
    }
  )

  return service
}

// 标准请求实例
export const request = createAxios()

// 业务API请求实例
export const Api = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}/papi`,
  withCredentials: true,
  timeout: 60000,
})

// 配置业务API拦截器
Api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`
  }
  config.headers['Content-Type'] =
    config.headers['Content-Type'] ?? 'application/json;charset=utf-8'
  return config
})

Api.interceptors.response.use(
  (resp) => {
    const headers = resp.headers

    // 处理文件下载
    if (
      headers['content-type'] === 'application/octet-stream;charset=UTF-8' ||
      headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8' ||
      headers['content-type'] ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' ||
      headers['content-type'] ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    ) {
      return resp
    }

    const { code, msg } = resp.data

    if (code === 401) {
      const { logout } = useAuthStore()
      const { router } = useRouterStore()
      logout()
      router.replace({ path: '/login' })
      return Promise.reject(new Error(msg))
    }

    if (code !== 200) {
      message.error(msg)
      return Promise.reject(new Error(msg))
    }

    return resp.data
  },
  (error: AxiosError<any>) => {
    message.error(error.message)
    return Promise.reject(error)
  }
)

export const MapApi = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}/auth/papi`,
  withCredentials: true,
  timeout: 60000,
})

// 配置地图API拦截器
MapApi.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`
  }
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  return config
})

MapApi.interceptors.response.use(
  (resp) => {
    const { code, msg } = resp.data

    if (code === 401) {
      const { logout } = useAuthStore()
      const { router } = useRouterStore()
      logout()
      router.replace({ path: '/login' })
      return Promise.reject(new Error(msg))
    }

    if (code !== 200) {
      message.error(msg)
      return Promise.reject(new Error(msg))
    }

    return resp.data
  },
  (error: AxiosError<any>) => {
    message.error(error.message)
    return Promise.reject(error)
  }
)

// 文件上传请求实例
export const FileOSS = axios.create({
  baseURL: '/spider-file-server',
  withCredentials: true,
  timeout: 120000,
})

// 配置文件上传拦截器
FileOSS.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `${accessToken}`, false)
      config.headers.set('Content-Type', 'multipart/form-data', false)
    } else {
      config.headers.Authorization = `${accessToken}`
      config.headers['Content-Type'] = 'multipart/form-data'
    }
  }
  return config
})

FileOSS.interceptors.response.use(
  (resp) => {
    return resp.data
  },
  (error: AxiosError<any>) => {
    let msg = ''

    if (error.message.includes('timeout')) {
      msg = '请求超时'
    } else if (error.message.includes('cancel')) {
      msg = '取消上传'
    } else {
      msg = error.response?.data?.message ?? `错误码 ${error.response?.status}`
    }

    notification.error({
      title: '错误',
      content: msg,
      duration: 3000,
    })

    return Promise.reject(error)
  }
)

export { message, notification }
export default Api
