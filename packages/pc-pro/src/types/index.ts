// 用户相关类型
export interface UserInfo {
  id: string
  username: string
  avatar?: string
  nickName?: string
  gender?: string
  address?: string
  email?: string
  roles: Role[]
  currentRole: Role
}

export interface Role {
  id: string
  name: string
  code: string
}

// 加载条API接口
export interface LoadingBarApiType {
  start: () => void
  finish: () => void
  error: () => void
}

// 权限相关类型
export interface Permission {
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
  children?: Permission[]
}

// HTTP相关类型
export interface ResOptions {
  needTip?: boolean
}

export interface HttpResponse<T = any> {
  code: number
  message: string
  data: T
  [key: string]: any
}

// 存储相关类型
export interface StorageOption {
  prefixKey?: string
  storage?: Storage
}

export interface StorageData<T = any> {
  value: T
  time: number
  expire: number | null
}
