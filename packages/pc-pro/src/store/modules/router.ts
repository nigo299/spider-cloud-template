import type { RouteLocationNormalized, Router } from 'vue-router'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

interface RouteRecord {
  name: string
  [key: string]: any
}

export const useRouterStore = defineStore('router', () => {
  const router: Router = useRouter()
  const route: RouteLocationNormalized = useRoute()

  function resetRouter(accessRoutes: RouteRecord[]): void {
    accessRoutes.forEach((item) => {
      router.hasRoute(item.name) && router.removeRoute(item.name)
    })
  }

  return {
    router,
    route,
    resetRouter,
  }
})
