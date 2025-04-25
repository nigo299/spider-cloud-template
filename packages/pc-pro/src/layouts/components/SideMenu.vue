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
  />
</template>

<script setup lang="ts">
import { useAppStore, usePermissionStore } from '@/store'
import { isExternal } from '@/utils'
import { NMenu } from 'naive-ui'

// 从store中定义的MenuItem类型
interface MenuItem {
  label: string
  key: string
  path?: string
  originPath?: string
  icon: () => any
  order: number
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeKey = computed<string | null>(() => route.meta?.parentKey as string || route.name as string)

const menu = ref<InstanceType<typeof NMenu> | null>(null)
watch(route, async () => {
  await nextTick()
  menu.value?.showOption()
})

function handleMenuSelect(key: string): void {
  // 从menus中查找对应的菜单项
  const findMenuItem = (items: MenuItem[], targetKey: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.key === targetKey)
        return item
      if (item.children?.length) {
        const found = findMenuItem(item.children, targetKey)
        if (found)
          return found
      }
    }
    return undefined
  }

  const item = findMenuItem(permissionStore.menus, key)
  if (!item)
    return

  if (item.originPath && isExternal(item.originPath)) {
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
        if (item.path)
          router.push({ path: item.path })
      },
    })
  }
  else {
    if (!item.path)
      return
    router.push({ path: item.path })
  }
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
