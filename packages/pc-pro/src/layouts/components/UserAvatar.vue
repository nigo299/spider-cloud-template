<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <n-avatar round :size="36" :src="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import api from '@/api'
import { useAuthStore, useUserStore } from '@/store'
import { h } from 'vue'

// 自定义下拉菜单项
interface CustomDropdownOption {
  label: string
  key: string
  icon?: () => any
}

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 定义下拉菜单选项
const menuItems: CustomDropdownOption[] = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
]

// 转换为naive-ui支持的下拉菜单选项
const options = computed<DropdownOption[]>(() =>
  menuItems.map((item) => ({
    label: item.label,
    key: item.key,
    icon: item.icon,
  }))
)

function handleSelect(key: string): void {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      window.$dialog.confirm({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        async confirm() {
          try {
            await api.logout()
          } catch (error) {
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
