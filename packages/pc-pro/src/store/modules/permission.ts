import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router/routes'
import type { AppRouteRecordRaw } from '@/router/types'

interface PermissionState {
  routes: AppRouteRecordRaw[]
  accessRoutes: AppRouteRecordRaw[]
  menus: any[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    accessRoutes: [],
    menus: [],
  }),

  actions: {
    generateRoutes() {
      // 不做权限过滤，直接返回所有异步路由
      this.routes = constantRoutes.concat(asyncRoutes)
      this.accessRoutes = asyncRoutes
      this.menus = generateMenus(asyncRoutes)
      return asyncRoutes
    },

    resetPermission() {
      this.$reset()
    },
  },
})

/**
 * 从路由生成菜单
 */
function generateMenus(routes: AppRouteRecordRaw[]): any[] {
  const menus: any[] = []

  routes.forEach((route) => {
    // 跳过不需要显示在菜单中的路由
    if ((route.meta as any)?.hidden) return

    const menu: any = {
      label: route.meta.title || '',
      key: route.name,
      path: route.path,
      iconClass: route.meta.icon, // 用 iconClass 存储
    }

    // 处理子菜单
    if (route.children && route.children.length > 0) {
      const childMenus = generateMenus(route.children)
      if (childMenus.length > 0) {
        menu.children = childMenus
      }
    }

    menus.push(menu)
  })

  return menus
}
