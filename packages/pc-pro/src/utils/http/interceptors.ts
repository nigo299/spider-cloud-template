import type { HttpResponse, ResOptions } from '@/types'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import { resolveResError } from './helpers'

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  const SUCCESS_CODES = [0, 200]

  function resResolve(response: AxiosResponse): Promise<any> {
    const { data, status, config, statusText, headers } = response
    if (headers['content-type']?.includes('json')) {
      if (SUCCESS_CODES.includes((data as HttpResponse)?.code)) {
        return Promise.resolve(data)
      }
      const code = (data as HttpResponse)?.code ?? status

      const needTip = (config as any)?.needTip !== false

      // 根据code处理对应的操作，并返回处理后的message
      const message = resolveResError(code, (data as HttpResponse)?.message ?? statusText, needTip)

      return Promise.reject({ code, message, error: data ?? response })
    }
    return Promise.resolve(data ?? response)
  }

  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use(resResolve, resReject)
}

function reqResolve(config: InternalAxiosRequestConfig & { needToken?: boolean, needTip?: boolean }): InternalAxiosRequestConfig {
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
}

function reqReject(error: any): Promise<never> {
  return Promise.reject(error)
}

async function resReject(error: AxiosError): Promise<never> {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code as string, error.message as string)
    return Promise.reject({ code, message, error })
  }

  const { data, status, config } = error.response
  const code = (data as HttpResponse)?.code ?? status

  const needTip = (config as ResOptions)?.needTip !== false
  const message = resolveResError(code, (data as HttpResponse)?.message ?? error.message, needTip)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}
