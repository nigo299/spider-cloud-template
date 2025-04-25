import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { setupInterceptors } from './interceptors'

/**
 * 创建axios实例
 * @param options 配置项
 * @returns axios实例
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
  setupInterceptors(service)
  return service
}

export const request = createAxios()

export const mockRequest = createAxios({
  baseURL: '/mock-api',
})
