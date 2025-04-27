import type { Router } from 'vue-router'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'

const WHITE_LIST = ['/login', '/404', '/403']

export function createPermissionGuard(router: Router): void {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    // 无token且访问非白名单页面，重定向至登录
    if (!token) {
      if (WHITE_LIST.includes(to.path)) {
        return next()
      }
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 有token访问登录页，重定向至首页
    if (to.path === '/login') {
      return next({ path: '/' })
    }

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 获取用户信息和权限
    if (!userStore.userInfo) {
      try {
        // 获取用户信息
        const userInfo = await getUserInfo()
        userStore.setUser(userInfo)

        // 直接生成所有本地权限路由
        const accessRoutes = permissionStore.generateRoutes()

        // 动态添加路由
        accessRoutes.forEach((route) => {
          if (route.name && !router.hasRoute(route.name)) {
            router.addRoute(route as any)
          }
        })

        // 重定向到相同的路由以确保路由配置生效
        return next({ ...to, replace: true })
      } catch (error) {
        console.error('获取用户信息失败', error)
        // 清除token，跳转到登录页
        authStore.resetToken()
        return next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }

    // 如果路由存在则允许访问
    if (to.name && router.hasRoute(to.name)) {
      return next()
    }

    // 路由不存在，跳转到404页面
    next({ path: '/404' })
  })
}
