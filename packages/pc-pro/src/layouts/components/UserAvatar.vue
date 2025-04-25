<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <n-avatar round :size="36" :src="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
        <span class="text-12 opacity-50">[{{ userStore.currentRole?.name }}]</span>
      </div>
    </div>
  </n-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { ComputedRef } from 'vue'
import api from '@/api'
import { RoleSelect } from '@/layouts/components'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import { h } from 'vue'

// 自定义下拉菜单项
interface CustomDropdownOption {
  label: string
  key: string
  icon?: () => any
  show?: ComputedRef<boolean>
}

interface RoleSelectInstance {
  open: (options?: { onOk?: () => void }) => void
}

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

// 定义下拉菜单选项
const menuItems: CustomDropdownOption[] = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
    show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/profile')),
  },
  {
    label: '切换角色',
    key: 'toggleRole',
    icon: () => h('i', { class: 'i-basil:exchange-solid text-14' }),
    show: computed(() => userStore.roles.length > 1),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
]

// 转换为naive-ui支持的下拉菜单选项
const options = computed<DropdownOption[]>(() =>
  menuItems
    .filter(item => !item.show || item.show.value)
    .map(item => ({
      label: item.label,
      key: item.key,
      icon: item.icon,
    })),
)

const roleSelectRef = ref<RoleSelectInstance | null>(null)
function handleSelect(key: string): void {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'toggleRole':
      roleSelectRef.value?.open({
        onOk() {
          location.reload()
        },
      })
      break
    case 'logout':
      window.$dialog.confirm({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        async confirm() {
          try {
            await api.logout()
          }
          catch (error) {
            console.error(error)
          }
          authStore.logout()
          window.$message.success('已退出登录')
        },
      })
      break
  }
}
</script>
