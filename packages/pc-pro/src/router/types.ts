import type { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    layout?: string
    keepAlive?: boolean
    requiresAuth?: boolean
    permissions?: string[]
    parentKey?: string | null
    btns?: Array<{ code: string, name: string }>
  }
}

export interface AppRouteRecordRaw {
  name: string
  path: string
  redirect?: string
  component?: any
  children?: AppRouteRecordRaw[]
  meta: {
    title?: string
    icon?: string
    layout?: string
    keepAlive?: boolean
    requiresAuth?: boolean
    permissions?: string[]
    parentKey?: string | null
    btns?: Array<{ code: string, name: string }>
  }
}

export interface TabItem {
  name: string | symbol | null
  path: string
  title?: string
  icon?: string
  keepAlive?: boolean
}

export type RouteLocationWithState = RouteLocationNormalized & {
  state?: {
    from?: string
  }
}
