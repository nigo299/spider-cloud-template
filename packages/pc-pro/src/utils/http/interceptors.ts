import type { AxiosError } from 'axios'
import { useAuthStore, useRouterStore } from '@/store'
import { Api, FileOSS, MapApi, message, notification } from './index'

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
