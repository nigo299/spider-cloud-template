<template>
  <NMenu
    ref="menu"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :options="permissionStore.menus"
    :value="activeKey"
    @update:value="handleMenuSelect"
    :render-icon="renderMenuIcon"
  />
</template>

<script setup lang="ts">
import { useAppStore, usePermissionStore } from '@/store'
import { isExternal } from '@/utils'
import { NMenu } from 'naive-ui'
import { h } from 'vue'

// 从store中定义的MenuItem类型
interface MenuItem {
  label: string
  key: string
  path?: string
  originPath?: string
  iconClass?: string
  order?: number
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeKey = computed<string | null>(() => {
  // 外链 iframe 页面：高亮 query.key
  if (route.path === '/iframe' && route.query.key) {
    return route.query.key as string
  }
  return (route.meta?.parentKey as string) || (route.name as string)
})

const menu = ref<InstanceType<typeof NMenu> | null>(null)
watch(route, async () => {
  await nextTick()
  menu.value?.showOption()
})

function handleMenuSelect(key: string): void {
  // 从menus中查找对应的菜单项
  const findMenuItem = (
    items: MenuItem[],
    targetKey: string,
    parentPath = ''
  ): { item?: MenuItem; fullPath?: string } => {
    for (const item of items) {
      const currentPath = item.path
        ? parentPath
          ? parentPath.replace(/\/$/, '') + '/' + item.path.replace(/^\//, '')
          : item.path
        : parentPath
      if (item.key === targetKey)
        return { item, fullPath: currentPath.startsWith('/') ? currentPath : '/' + currentPath }
      if (item.children?.length) {
        const found = findMenuItem(item.children, targetKey, currentPath)
        if (found.item) return found
      }
    }
    return {}
  }

  const { item, fullPath } = findMenuItem(permissionStore.menus, key)
  if (!item || !fullPath) return

  if (item.path && isExternal(item.path)) {
    window.$dialog.confirm({
      type: 'info',
      title: `请选择打开方式`,
      positiveText: '外链打开',
      negativeText: '在本站内嵌打开',
      confirm() {
        if (item.originPath) {
          window.open(item.originPath)
        }
      },
      cancel: () => {
        // 在本站内嵌打开，跳转到 iframe 页面并传递 url、标题、icon、key、parentKey 参数
        // 递归查找父级key
        function findParentKey(
          items: MenuItem[],
          targetKey: string,
          parentKey: string | null = null
        ): string | null {
          for (const menu of items) {
            if (menu.key === targetKey) return parentKey
            if (menu.children) {
              const found: string | null = findParentKey(menu.children, targetKey, menu.key)
              if (found) return found
            }
          }
          return null
        }
        const parentKey = findParentKey(permissionStore.menus, item.key)
        router.push({
          path: '/iframe',
          query: {
            url: item.path,
            title: item.label,
            icon: item.iconClass,
            key: item.key,
            parentKey: parentKey,
          },
        })
      },
    })
  } else {
    router.push({ path: fullPath })
  }
}

function renderMenuIcon(option: any) {
  return option.iconClass ? h('i', { class: `${option.iconClass} text-18` }) : null
}
</script>

<style lang="less">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 8px;
      right: 8px;
    }
    &.n-menu-item-content--selected::before {
      border-left: 4px solid rgb(var(--primary-color));
    }
  }
}
</style>
