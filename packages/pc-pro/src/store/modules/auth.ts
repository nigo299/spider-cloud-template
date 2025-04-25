import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/store'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface AuthState {
  accessToken: string | undefined
}

interface TokenData {
  accessToken: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: undefined,
  }),
  actions: {
    setToken({ accessToken }: TokenData): void {
      this.accessToken = accessToken
    },
    resetToken(): void {
      this.$reset()
    },
    toLogin(): void {
      const { router, route } = useRouterStore()
      router.replace({
        path: '/login',
        query: route.query,
      })
    },
    async switchCurrentRole(data: TokenData): Promise<void> {
      this.resetLoginState()
      await nextTick()
      this.setToken(data)
    },
    resetLoginState(): void {
      const { resetUser } = useUserStore()
      const { resetRouter } = useRouterStore()
      const { resetPermission, accessRoutes } = usePermissionStore()
      const { resetTabs } = useTabStore()
      // 重置路由
      resetRouter(accessRoutes)
      // 重置用户
      resetUser()
      // 重置权限
      resetPermission()
      // 重置Tabs
      resetTabs()
      // 重置token
      this.resetToken()
    },
    async logout(): Promise<void> {
      this.resetLoginState()
      this.toLogin()
    },
  },
  persist: {
    key: 'vue-naivue-admin_auth',
  },
})
