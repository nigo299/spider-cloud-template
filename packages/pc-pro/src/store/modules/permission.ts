import { isExternal } from '@/utils'
import { hyphenate } from '@vueuse/core'
import { defineStore } from 'pinia'
import { h } from 'vue'

interface PermissionState {
  accessRoutes: Array<RouteRecord>
  permissions: Array<Permission>
  menus: Array<MenuItem>
}

interface Permission {
  type: string
  enable?: boolean
  show?: boolean
  code: string
  name: string
  path?: string
  component?: string
  redirect?: string
  icon?: string
  layout?: string
  keepAlive?: boolean
  order?: number
  children?: Permission[]
}

interface MenuItem {
  label: string
  key: string
  path?: string
  originPath?: string
  icon: () => any
  order: number
  children?: MenuItem[]
}

interface RouteRecord {
  name: string
  path: string
  redirect?: string
  component?: string
  meta: {
    originPath?: string
    icon?: string
    title: string
    layout?: string
    keepAlive: boolean
    parentKey?: string | null
    btns?: Array<{ code: string, name: string }>
  }
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    accessRoutes: [],
    permissions: [],
    menus: [],
  }),
  actions: {
    setPermissions(permissions: Permission[]): void {
      this.permissions = permissions
      this.menus = this.permissions
        .filter(item => item.type === 'MENU')
        .map(item => this.getMenuItem(item))
        .filter(item => !!item)
        .sort((a, b) => a.order - b.order)
    },
    getMenuItem(item: Permission, parent?: MenuItem): MenuItem | null {
      const route = this.generateRoute(item, item.show ? null : parent?.key || null)
      if (item.enable && route.path && !route.path.startsWith('http'))
        this.accessRoutes.push(route)
      if (!item.show)
        return null
      const menuItem: MenuItem = {
        label: route.meta.title,
        key: route.name,
        path: route.path,
        originPath: route.meta.originPath,
        icon: () => h('i', { class: `${route.meta.icon} text-16` }),
        order: item.order ?? 0,
      }
      const children = item.children?.filter(item => item.type === 'MENU') || []
      if (children.length) {
        menuItem.children = children
          .map(child => this.getMenuItem(child, menuItem))
          .filter(item => !!item)
          .sort((a, b) => a.order - b.order)
        if (!menuItem.children.length)
          delete menuItem.children
      }
      return menuItem
    },
    generateRoute(item: Permission, parentKey: string | null): RouteRecord {
      let originPath
      if (isExternal(item.path || '')) {
        originPath = item.path
        item.component = '/src/views/iframe/index.vue'
        item.path = `/iframe/${hyphenate(item.code)}`
      }
      return {
        name: item.code,
        path: item.path || '',
        redirect: item.redirect,
        component: item.component,
        meta: {
          originPath,
          icon: `${item.icon}?mask`,
          title: item.name,
          layout: item.layout,
          keepAlive: !!item.keepAlive,
          parentKey,
          btns: item.children
            ?.filter(item => item.type === 'BUTTON')
            .map(item => ({ code: item.code, name: item.name })),
        },
      }
    },
    resetPermission(): void {
      this.$reset()
    },
  },
})
