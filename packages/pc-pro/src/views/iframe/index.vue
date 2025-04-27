<template>
  <AppPage full>
    <iframe :src="(route.query.url as string) || ''" frameborder="0" class="wh-full" />
  </AppPage>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

// 声明路由meta类型，包含originPath属性
declare module 'vue-router' {
  interface RouteMeta {
    originPath?: string
  }
}

defineOptions({ name: 'IframePage' })

const route = useRoute()
const router = useRouter()

function syncMetaFromQuery() {
  // 动态设置 route.meta，供面包屑、页签、菜单高亮使用
  if (route.query.title) route.meta.title = route.query.title as string
  if (route.query.icon) route.meta.iconClass = route.query.icon as string
  if (route.query.key) route.meta.key = route.query.key as string
  if (route.query.parentKey) route.meta.parentKey = route.query.parentKey as string
}

onMounted(syncMetaFromQuery)
watch(() => route.fullPath, syncMetaFromQuery)
</script>
