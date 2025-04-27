<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-if="!breadItems?.length" :clickable="false">
      {{ route.meta.title }}
    </n-breadcrumb-item>
    <n-breadcrumb-item
      v-for="(item, index) of breadItems"
      v-else
      :key="item.key"
      :clickable="!!item.path && index !== 0"
      @click="handleItemClick(item)"
    >
      <n-dropdown
        :options="index < breadItems.length - 1 ? getDropOptions(item.children) : []"
        @select="handleDropSelect"
      >
        <div class="flex items-center">
          <i :class="item.iconClass" class="mr-8" />
          {{ item.label }}
        </div>
      </n-dropdown>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { usePermissionStore } from '@/store'

interface BreadcrumbItem {
  key: string
  label: string
  path?: string
  iconClass?: string
  children?: BreadcrumbItem[]
  show?: boolean
}

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

const breadItems = ref<BreadcrumbItem[]>([])
watch(
  () => route.name,
  (v) => {
    breadItems.value = findMatchs(permissionStore.menus, v as string) || []
  },
  { immediate: true }
)

function findMatchs(
  tree: BreadcrumbItem[],
  key: string,
  parents: BreadcrumbItem[] = []
): BreadcrumbItem[] | null {
  for (const item of tree) {
    if (item.key === key) {
      return [...parents, item]
    }
    if (item.children?.length) {
      const found = findMatchs(item.children, key, [...parents, item])
      if (found) {
        return found
      }
    }
  }
  return null
}

function handleItemClick(item: BreadcrumbItem): void {
  if (item.path && item.key !== route.name) {
    router.push(item.path)
  }
}

function getDropOptions(list: BreadcrumbItem[] = []): DropdownOption[] {
  return list.map((child) => ({
    label: child.label,
    key: child.key,
    icon: child.iconClass ? () => h('i', { class: child.iconClass }) : undefined,
  }))
}

function handleDropSelect(key: string): void {
  if (key && key !== route.name) {
    router.push({ name: key })
  }
}
</script>
