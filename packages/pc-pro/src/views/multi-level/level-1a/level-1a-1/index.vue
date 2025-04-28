<template>
  <n-result status="success" title="菜单 1-A-1" description="这是 1-A-1 子菜单页面">
    <template #footer>
      <n-space>
        <n-button type="primary" @click="router.push('/multi-level/level-1a')"
          >返回上级菜单</n-button
        >
        <n-button @click="router.push('/multi-level/level-1a/level-1a-2')">访问兄弟菜单</n-button>
      </n-space>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'Level1A1' })

const router = useRouter()
</script>
