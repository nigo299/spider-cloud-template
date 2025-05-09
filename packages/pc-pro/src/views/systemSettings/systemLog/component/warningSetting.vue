<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { ref, watch } from 'vue'
import { NModal, NButton, NInputNumber, NSpace } from 'naive-ui'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  alarmNum: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['close', 'submit'])

const [settingVisible, settingToggle] = useToggle()
const settingNum = ref(1)

watch(
  () => props.visible,
  (val) => {
    settingToggle(val)
  }
)

watch(
  () => props.alarmNum,
  (val) => {
    settingNum.value = val
  }
)

function handleCancel() {
  settingToggle(false)
  emits('close')
}

function handleSubmit() {
  if (settingNum.value < 10000000 && settingNum.value > 0) emits('submit', settingNum.value)
  else window.$message.warning('请输入1-10000000内整数')
}
</script>

<template>
  <div>
    <NModal
      v-model:show="settingVisible"
      title="预警设置"
      :mask-closable="false"
      style="width: 500px"
      preset="dialog"
      @close="handleCancel"
    >
      <div class="flex items-center p-4">
        <span>日志条数:</span>
        <NInputNumber
          v-model:value="settingNum"
          :min="1"
          :max="10000000"
          class="flex-1 ml-4"
          placeholder="请输入1-10000000内整数"
        />
      </div>
      <template #action>
        <NSpace>
          <NButton @click="handleCancel"> 取消 </NButton>
          <NButton type="primary" ghost @click="handleSubmit"> 保存 </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>
