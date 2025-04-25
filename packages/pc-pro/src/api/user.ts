import type { HttpResponse } from '@/types'
import type { AxiosRequestConfig } from 'axios'
import type { TokenResponse, UserDetail } from './types'
import { request } from '@/utils'

/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
  username: string
  password: string
  email?: string
  nickName?: string
}

/**
 * 用户API接口
 */
export const userApi = {
  /**
   * 用户登录
   * @param params 登录参数
   */
  login(params: LoginParams): Promise<HttpResponse<TokenResponse>> {
    return request.post('/auth/login', params)
  },

  /**
   * 用户注册
   * @param params 注册参数
   */
  register(params: RegisterParams): Promise<HttpResponse<UserDetail>> {
    return request.post('/auth/register', params)
  },

  /**
   * 获取用户详细信息
   */
  getUserInfo(): Promise<HttpResponse<UserDetail>> {
    return request.get('/user/detail')
  },

  /**
   * 刷新身份令牌
   */
  refreshToken(): Promise<HttpResponse<TokenResponse>> {
    return request.get('/auth/refresh/token')
  },

  /**
   * 用户登出
   */
  logout(): Promise<HttpResponse<null>> {
    return request.post('/auth/logout', {}, {
      needTip: false,
    } as AxiosRequestConfig)
  },

  /**
   * 切换当前角色
   * @param role 角色ID
   */
  switchCurrentRole(role: string): Promise<HttpResponse<{ success: boolean }>> {
    return request.post(`/auth/current-role/switch/${role}`)
  },

  /**
   * 更新用户信息
   * @param data 用户信息
   */
  updateUserInfo(data: Partial<UserDetail>): Promise<HttpResponse<UserDetail>> {
    return request.put('/user/info', data)
  },

  /**
   * 更新用户密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  updatePassword(oldPassword: string, newPassword: string): Promise<HttpResponse<null>> {
    return request.put('/user/password', { oldPassword, newPassword })
  },
}
