import type { Router } from 'vue-router'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'

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

    // 有 token 且未挂载菜单时，自动生成并挂载本地菜单路由
    if (token && permissionStore.routes.length === 0) {
      const accessRoutes = permissionStore.generateRoutes()
      accessRoutes.forEach((route) => {
        if (route.name && !router.hasRoute(route.name)) {
          router.addRoute(route as any)
        }
      })

      // 添加404路由规则放到最后
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'NotFound',
        meta: {
          hidden: true,
        },
      })

      // 添加完路由后，重新导航到当前页面，确保路由能被正确匹配
      return next({ ...to, replace: true })
    }

    // 已不再需要远程获取用户信息，直接通过本地权限和 token 判断

    // 如果路由存在则允许访问
    if (to.name && router.hasRoute(to.name)) {
      return next()
    }

    // 路由不存在，跳转到404页面
    next({ path: '/404' })
  })
}
