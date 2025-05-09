import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/store'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface AuthState {
  accessToken: string | undefined
  userName: string | undefined
  userAccount: string | undefined
}

interface TokenData {
  accessToken: string
  userName?: string
  userAccount?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: undefined,
    userName: undefined,
    userAccount: undefined,
  }),
  actions: {
    setToken({ accessToken, userName, userAccount }: TokenData): void {
      this.accessToken = accessToken
      this.userName = userName
      this.userAccount = userAccount
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
