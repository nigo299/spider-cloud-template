<script setup lang="ts">
import { debounce } from 'lodash-es'
import { computed, ref } from 'vue'

const props = defineProps({
  statusVisible: {
    type: Boolean,
    default: false,
  },
  isBatch: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '开启',
  },
})
const emits = defineEmits(['statusCancelEmit', 'statusConfirmEmit'])
const tipText = computed(() => {
  return props.isBatch ? '这些' : '此'
})
const isEditShow = ref(false)
const formState = ref({
  lockDuration: 365,
  lockType: 0,
  validityPeriodType: 0,
  validDuration: 90,
})

function handleCancel() {
  emits('statusCancelEmit')
}

function handleConfirm() {
  emits('statusConfirmEmit', formState.value)
}
const debounceConfirm = debounce(handleConfirm, 500, { leading: true, trailing: false })

// 表单重置
function resetForm() {
  formState.value = {
    lockDuration: 365,
    lockType: 0,
    validityPeriodType: 0,
    validDuration: 90,
  }
}
defineExpose({
  resetForm,
})
</script>

<template>
  <div class="organization">
    <n-modal
      :show="statusVisible"
      :title="title"
      :mask-closable="false"
      style="width: 30%"
      @close="handleCancel"
    >
      <div v-if="title === '开启'">
        <p>确定要启用{{ tipText }}账号吗？启用{{ tipText }}账号需设置有效期</p>
        <div class="flex mt-10px justify-center">
          <p class="w-25">账号类型：</p>
          <n-radio-group v-model:value="formState.validityPeriodType" class="w-full">
            <n-radio :value="0" :disabled="isEditShow"> 永久账号 </n-radio>
            <br />
            <n-radio :value="1" :disabled="isEditShow">
              <span>临时账号</span>
              <div v-if="formState.validityPeriodType === 1" class="ml-8 inline-block">
                有效时长（天）：
                <n-input-number
                  id="inputNumber"
                  v-model:value="formState.validDuration"
                  :min="1"
                  :max="90"
                />
              </div>
            </n-radio>
          </n-radio-group>
        </div>
      </div>
      <div v-else>
        <p>你确定需要锁定{{ tipText }}账户吗？</p>
        <div class="flex mt-10px justify-center">
          <p class="w-25">锁定时长：</p>
          <n-radio-group v-model:value="formState.lockType" class="w-full">
            <n-radio :value="0" :disabled="isEditShow"> 永久 </n-radio>
            <br />
            <n-radio :value="1" :disabled="isEditShow">
              <span>自定义</span>
              <div v-if="formState.lockType === 1" class="ml-8 inline-block">
                <n-input-number
                  id="inputNumber"
                  v-model:value="formState.lockDuration"
                  :min="1"
                  :max="365"
                />
                （天）
              </div>
            </n-radio>
          </n-radio-group>
        </div>
      </div>

      <template #action>
        <n-space>
          <n-button @click="handleCancel"> 取消 </n-button>
          <n-button type="primary" :loading="loading" @click="debounceConfirm"> 确定 </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<style lang="less" scoped>
.organization {
  :deep(.n-modal-header) {
    text-align: center;
  }
}
</style>
