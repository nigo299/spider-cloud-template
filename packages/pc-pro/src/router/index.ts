import type { App } from 'vue'
import type { Router } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { setupRouterGuards } from './guards'

export const router: Router = createRouter({
  history:
    import.meta.env.VITE_USE_HASH === 'true'
      ? createWebHashHistory('')
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
  routes: constantRoutes as any,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App<Element>): Promise<void> {
  app.use(router)
  setupRouterGuards(router)
}
