<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <span class="text-14">{{ userName }}</span>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { h } from 'vue'

defineOptions({
  name: 'UserAvatar',
})

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.userName || '用户')

// 自定义下拉菜单项
interface CustomDropdownOption {
  label: string
  key: string
  icon?: () => any
}

// 定义下拉菜单选项
const menuItems: CustomDropdownOption[] = [
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
          await authStore.logout()
          window.$message.success('已退出登录')
        },
      })
      break
  }
}
</script>
