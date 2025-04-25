import { defineStore } from 'pinia'

interface Role {
  id: number | string
  name: string
  code: string
  [key: string]: any
}

interface UserInfo {
  id: number | string
  username: string
  nickName: string
  avatar?: string
  currentRole?: Role
  roles?: Role[]
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
  }),
  getters: {
    userId(): number | string | undefined {
      return this.userInfo?.id
    },
    username(): string | undefined {
      return this.userInfo?.username
    },
    nickName(): string | undefined {
      return this.userInfo?.nickName
    },
    avatar(): string | undefined {
      return this.userInfo?.avatar
    },
    currentRole(): Role | undefined {
      return this.userInfo?.currentRole as Role | undefined
    },
    roles(): Role[] {
      return this.userInfo?.roles || []
    },
  },
  actions: {
    setUser(user: UserInfo): void {
      this.userInfo = user
    },
    resetUser(): void {
      this.$reset()
    },
  },
})
