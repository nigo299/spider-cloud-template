<script setup lang="ts">
import { legacyLogicalPropertiesTransformer } from 'ant-design-vue'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { RouterView } from 'vue-router'

import { layoutConfig } from './config/layout'
import { themeConfig } from './config/theme'
</script>

<template>
  <a-style-provider hash-priority="high" :transformers="[legacyLogicalPropertiesTransformer]">
    <a-config-provider
      :locale="zhCN"
      :theme="{
        token: themeConfig.light,
      }"
    >
      <RouterView v-slot="{ Component }">
        <keep-alive v-if="layoutConfig.tabConfig.keepAlive">
          <component :is="Component" />
        </keep-alive>
        <component :is="Component" v-else />
      </RouterView>
    </a-config-provider>
  </a-style-provider>
</template>
