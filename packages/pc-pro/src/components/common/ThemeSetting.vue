<template>
  <div class="f-c-c">
    <n-tooltip trigger="hover" placement="bottom">
      <template #trigger>
        <n-color-picker
          id="theme-setting"
          class="h-32 w-32"
          :value="appStore.primaryColor"
          :swatches="primaryColors"
          :on-update:value="(v) => appStore.setPrimaryColor(v)"
          :render-label="() => ''"
        />
      </template>
      设置主题色
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
// @ts-expect-error 忽略报错
import { getPresetColors } from '@arco-design/color'

const appStore = useAppStore()
// @ts-expect-error 忽略报错
const primaryColors = Object.entries(getPresetColors()).map(([, value]) => value.primary)
</script>
