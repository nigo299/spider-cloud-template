// src/types/store.ts
import type { RouteLocationNormalized, Router } from 'vue-router'

// 由于无法直接从naive-ui导入LoadingBarInst类型，这里声明一个通用类型
interface LoadingBarApiType {
  start: () => void
  finish: () => void
  error: () => void
}

/**
 * 全局环境变量声明
 */
declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var $loadingBar: LoadingBarApiType
}

/**
 * 用户相关类型
 */
export interface Role {
  id: number | string
  name: string
  code: string
  [key: string]: any
}

export interface UserInfo {
  id: number | string
  username: string
  nickName: string
  avatar?: string
  currentRole?: Role
  roles?: Role[]
  [key: string]: any
}

/**
 * 路由相关类型
 */
export interface RouteRecord {
  name: string
  path: string
  redirect?: string
  component?: string
  meta: {
    originPath?: string
    icon?: string
    title: string
    layout?: string
    keepAlive: boolean
    parentKey?: string | null
    btns?: Array<{ code: string, name: string }>
  }
}

/**
 * 权限相关类型
 */
export interface Permission {
  type: string
  enable?: boolean
  show?: boolean
  code: string
  name: string
  path?: string
  component?: string
  redirect?: string
  icon?: string
  layout?: string
  keepAlive?: boolean
  order?: number
  children?: Permission[]
}

export interface MenuItem {
  label: string
  key: string
  path?: string
  originPath?: string
  icon: () => any
  order: number
  children?: MenuItem[]
}

/**
 * 应用状态类型
 */
export interface AppState {
  collapsed: boolean
  isDark: boolean
  layout: string
  primaryColor: string
  naiveThemeOverrides: any
}

/**
 * 认证状态类型
 */
export interface AuthState {
  accessToken: string | undefined
}

export interface TokenData {
  accessToken: string
}

/**
 * 权限状态类型
 */
export interface PermissionState {
  accessRoutes: Array<RouteRecord>
  permissions: Array<Permission>
  menus: Array<MenuItem>
}

/**
 * 路由状态类型
 */
export interface RouterState {
  router: Router
  route: RouteLocationNormalized
  resetRouter: (accessRoutes: RouteRecord[]) => void
}

/**
 * Tab相关类型
 */
export interface TabItem {
  path: string
  keepAlive?: boolean
  [key: string]: any
}

export interface TabState {
  tabs: TabItem[]
  activeTab: string
  reloading: boolean
}
