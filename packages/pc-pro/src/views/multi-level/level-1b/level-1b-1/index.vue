<template>
  <n-result status="warning" title="菜单 1-B-1" description="这是单个子菜单示例页面">
    <template #icon>
      <n-icon size="48" class="text-orange-500">
        <span class="i-fe:target text-48"></span>
      </n-icon>
    </template>
    <template #footer>
      <n-space vertical>
        <n-button type="primary" @click="router.push('/multi-level/level-1b')"
          >返回上级菜单</n-button
        >
        <n-divider>快速跳转</n-divider>
        <n-space>
          <n-button @click="router.push('/multi-level/level-1a/level-1a-1')"
            >访问 1-A-1 菜单</n-button
          >
          <n-button @click="router.push('/multi-level/level-1a/level-1a-2')"
            >访问 1-A-2 菜单</n-button
          >
        </n-space>
      </n-space>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'Level1B1' })

const router = useRouter()
</script>
