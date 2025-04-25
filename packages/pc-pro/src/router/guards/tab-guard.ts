import type { RouteLocationNormalized, Router } from 'vue-router'
import { useTabStore } from '@/store'

export const EXCLUDE_TAB = ['/404', '/403', '/login']

export function createTabGuard(router: Router): void {
  router.afterEach((to: RouteLocationNormalized) => {
    if (EXCLUDE_TAB.includes(to.path))
      return
    const tabStore = useTabStore()
    const { name, fullPath: path } = to
    const title = to.meta?.title as string | undefined
    const icon = to.meta?.icon as string | undefined
    const keepAlive = to.meta?.keepAlive as boolean | undefined
    tabStore.addTab({ name, path, title, icon, keepAlive })
  })
}
