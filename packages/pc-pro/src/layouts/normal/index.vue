<template>
  <div class="wh-full flex">
    <aside
      class="flex-col flex-shrink-0 transition-width-300"
      :class="appStore.collapsed ? 'w-64' : 'w-220'"
      border-r="1px solid light_border dark:dark_border"
    >
      <SideBar />
    </aside>

    <article class="w-0 flex-col flex-1">
      <AppHeader class="h-60 flex-shrink-0" />
      <slot />
    </article>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import AppHeader from './header/index.vue'
import SideBar from './sidebar/index.vue'

const appStore = useAppStore()
</script>

<style>
.collapsed {
  width: 64px;
}
</style>
