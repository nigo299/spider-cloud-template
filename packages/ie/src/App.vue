<script setup lang="ts">
// 点击坐上logo和标题 无缝刷新
import { nextTick, provide, ref } from 'vue'

const isRouterActive = ref(true)

provide('htmlReload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>

<template>
  <div id="root">
    <main text="center gray-700">
      <router-view v-if="isRouterActive" />
    </main>
  </div>
</template>
