<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { ref, watch, computed } from 'vue'

import { customDelay } from '@/common/js/config'

export interface DelayLoading {
  delay: number
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '删除操作',
  },
  message: {
    type: String,
    default: '你确定需要删除此数据么？',
  },
  hint: {
    type: String,
    default: '此数据删除后将无法恢复，请谨慎操作。',
  },
})

const emits = defineEmits(['cancel', 'confirm'])

const delayLoadingState = ref<false | DelayLoading>(false)
// 计算属性转换为Naive UI按钮需要的布尔类型
const delayLoading = computed(() => !!delayLoadingState.value)

function handleCancel() {
  emits('cancel')
}

function handleConfirm() {
  emits('confirm')
}
const debounceConfirm = debounce(handleConfirm, 500, { leading: true, trailing: false })

watch(
  () => props.loading,
  (loading) => {
    if (loading) delayLoadingState.value = { delay: customDelay }
    else delayLoadingState.value = false
  }
)
</script>

<template>
  <div>
    <n-modal
      :show="visible"
      :title="title"
      :mask-closable="false"
      style="width: 30%"
      preset="dialog"
      @close="handleCancel"
    >
      <template #default>
        <p class="text-[16px]">
          {{ message }}
        </p>
        <p class="mt-[10px] text-[#aaa]">
          {{ hint }}
        </p>
      </template>
      <template #action>
        <n-space>
          <n-button @click="handleCancel"> 取消 </n-button>
          <n-button type="error" ghost :loading="delayLoading" @click="debounceConfirm">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
