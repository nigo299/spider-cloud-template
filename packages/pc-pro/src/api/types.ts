import type { HttpResponse } from '@/types'

/**
 * 用户详情响应数据
 */
export interface UserDetail {
  id: string | number
  username: string
  enable: boolean
  createTime: string
  updateTime: string
  profile: {
    id: string | number
    nickName?: string
    gender?: string | null
    avatar?: string
    address?: string | null
    email?: string | null
    userId: string | number
  }
}

/**
 * 令牌响应数据
 */
export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * 角色权限节点
 */
export interface RolePermission {
  id: string
  code: string
  name: string
  type: 'MENU' | 'BUTTON'
  icon?: string
  path?: string
  component?: string
  redirect?: string
  layout?: string
  order: number
  enable: boolean
  show: boolean
  keepAlive?: boolean
  children?: RolePermission[]
}

/**
 * 菜单路径验证结果
 */
export interface MenuValidation {
  valid: boolean
  message?: string
}

/**
 * API接口定义
 */
export interface Api {
  /**
   * 获取用户详细信息
   */
  getUser: () => Promise<HttpResponse<UserDetail>>

  /**
   * 刷新身份令牌
   */
  refreshToken: () => Promise<HttpResponse<TokenResponse>>

  /**
   * 用户登出
   */
  logout: () => Promise<HttpResponse<null>>

  /**
   * 获取角色权限树
   */
  getRolePermissions: () => Promise<HttpResponse<RolePermission[]>>

  /**
   * 验证菜单路径是否有效
   * @param path 菜单路径
   */
  validateMenuPath: (path: string) => Promise<HttpResponse<MenuValidation>>
}
