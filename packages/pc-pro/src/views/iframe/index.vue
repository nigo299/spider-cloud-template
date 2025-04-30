<template>
  <AppPage full>
    <div v-if="!iframeUrl" class="flex h-full w-full items-center justify-center">
      <div class="text-center">
        <div class="mb-4 text-24 text-error">⚠️</div>
        <div class="text-16 text-gray-500">无效的外部链接</div>
      </div>
    </div>
    <iframe
      v-else
      :src="iframeUrl"
      frameborder="0"
      class="wh-full"
      @load="handleIframeLoad"
      @error="handleIframeError"
    />
  </AppPage>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
import { isExternal } from '@/utils'

// 声明路由meta类型，包含originPath属性
declare module 'vue-router' {
  interface RouteMeta {
    originPath?: string
  }
}

defineOptions({ name: 'IframePage' })

const route = useRoute()
const router = useRouter()
const iframeUrl = ref<string>('')
const loadError = ref<boolean>(false)

function validateAndSetUrl() {
  const url = route.query.url as string
  if (url && isExternal(url)) {
    iframeUrl.value = url
    console.log('Iframe加载URL:', url)
  } else {
    iframeUrl.value = ''
    console.error('无效的iframe URL:', url)
  }
}

function syncMetaFromQuery() {
  // 动态设置 route.meta，供面包屑、页签、菜单高亮使用
  if (route.query.title) route.meta.title = route.query.title as string
  if (route.query.icon) route.meta.iconClass = route.query.icon as string
  if (route.query.key) route.meta.key = route.query.key as string
  if (route.query.parentKey) route.meta.parentKey = route.query.parentKey as string

  validateAndSetUrl()
}

function handleIframeLoad() {
  loadError.value = false
  console.log('Iframe加载成功')
}

function handleIframeError() {
  loadError.value = true
  console.error('Iframe加载失败')
  window.$message.error('外部链接加载失败')
}

onMounted(syncMetaFromQuery)
watch(() => route.fullPath, syncMetaFromQuery)
</script>
