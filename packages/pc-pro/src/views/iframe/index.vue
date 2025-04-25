<template>
  <AppPage full>
    <iframe :src="route.meta.originPath as string" frameborder="0" class="wh-full" />
  </AppPage>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

// 声明路由meta类型，包含originPath属性
declare module 'vue-router' {
  interface RouteMeta {
    originPath?: string
  }
}

defineOptions({ name: 'IframePage' })

const route = useRoute()
</script>
