<template>
  <CommonPage show-footer>
    <template #title-suffix>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <a
            href="https://juejin.cn/post/7394789388154241033"
            target="_blank"
            class="ml-12 flex cursor-pointer items-center hover:underline"
          >
            <i class="i-simple-icons:juejin text-#1E80FF" />
            <span class="ml-4">Unocss 图标</span>
          </a>
        </template>
        点击查看如何使用 Unocss 图标
      </n-tooltip>
    </template>
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] justify-items-center gap-16">
      <li
        v-for="item in icons"
        :key="item"
        class="w-160 f-c-c flex-col cursor-pointer rounded-12 px-12 py-24 card-border auto-bg"
        @click="copy(`&lt;i class=&quot;${item}&quot; /&gt;`)"
      >
        <i :class="`${item}?mask`" class="text-28 text-gray-600 hover:bg-primary" />
        <span
          class="mt-16 text-center text-14 text-gray-400 hover:color-primary"
          @click.stop="copy(item)"
        >
          {{ item }}
        </span>
      </li>
    </ul>
  </CommonPage>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import icons from 'isme:icons'
import { watch } from 'vue'

// useClipboard hook返回的值
interface ClipboardReturn {
  copy: (text: string) => Promise<void>
  copied: Ref<boolean>
  isSupported: Ref<boolean>
}

const { copy, copied }: ClipboardReturn = useClipboard()

watch(copied, (val: boolean) => {
  if (val) window.$message.success('已复制到剪切板')
})
</script>
