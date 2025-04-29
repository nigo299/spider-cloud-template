import { defineStore } from 'pinia'

interface UserInfo {
  id: number | string
  username: string
  nickName: string
  avatar?: string
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
