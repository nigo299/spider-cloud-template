<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'

import { layoutSettingVisible } from './settings'

import type { Component } from 'vue'

import { LayoutSetting } from '@/components'
import { useAppStore, useTabStore } from '@/store'

const layouts = new Map<string, Component>()

function getLayout(name: string): Component {
  // 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
  if (layouts.get(name)) {
    return layouts.get(name) as Component
  }
  const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
  layouts.set(name, layout)
  return layout
}

const route = useRoute()
const appStore = useAppStore()

if (appStore.layout === 'default') {
  appStore.setLayout('')
}
const Layout = computed(() => {
  if (!route.matched?.length) {
    return null
  }
  return getLayout((route.meta?.layout as string) || appStore.layout)
})

const tabStore = useTabStore()
const keepAliveNames = computed<string[]>(() => {
  return tabStore.tabs
    .filter((item: { keepAlive: boolean }) => item.keepAlive)
    .map((item: { name: string }) => item.name)
})

watchEffect(() => {
  appStore.setThemeColor(appStore.primaryColor, appStore.isDark)
})
</script>

<template>
  <n-config-provider
    class="wh-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="appStore.isDark ? darkTheme : undefined"
    :theme-overrides="appStore.naiveThemeOverrides"
  >
    <router-view v-if="Layout" v-slot="{ Component: curComponent, route: curRoute }">
      <component :is="Layout">
        <transition name="fade-slide" mode="out-in" appear>
          <KeepAlive :include="keepAliveNames">
            <component :is="curComponent" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
          </KeepAlive>
        </transition>
      </component>

      <LayoutSetting v-if="layoutSettingVisible" class="fixed right-12 top-1/2 z-999" />
    </router-view>
  </n-config-provider>
</template>
