<script setup lang="ts">
import { ref, watch } from 'vue'
import { NTag, NDescriptions, NDescriptionsItem, NModal } from 'naive-ui'

import { formatTime } from '@/utils/format'

import { LOG_STATUS } from '../enum'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['close'])
const logsVisible = ref<boolean>(false)
watch(
  () => props.visible,
  (val) => {
    logsVisible.value = val
  }
)

const handleCancel = () => {
  emits('close')
}
</script>

<template>
  <NModal
    v-model:show="logsVisible"
    style="width: 50%"
    :mask-closable="false"
    preset="card"
    title="日志详情"
    @close="handleCancel"
  >
    <NDescriptions bordered>
      <NDescriptionsItem label="姓名">
        {{ props.data.operationName }}
      </NDescriptionsItem>
      <NDescriptionsItem label="操作账号" :span="2">
        {{ props.data.account }}
      </NDescriptionsItem>
      <NDescriptionsItem label="事件类型">
        {{ props.data.eventType }}
      </NDescriptionsItem>
      <NDescriptionsItem label="事件分类" :span="2">
        {{ props.data.eventCategory }}
        {{ props.data.abnormalEventDescribe ? `(${props.data.abnormalEventDescribe})` : '' }}
      </NDescriptionsItem>
      <NDescriptionsItem label="操作内容" :span="3">
        {{ props.data.content }}
      </NDescriptionsItem>
      <NDescriptionsItem label="请求地址" :span="3">
        {{ props.data.interfacePath?.substring(1) }}
      </NDescriptionsItem>
      <NDescriptionsItem label="执行时长(毫秒)">
        {{ props.data.duration }}
      </NDescriptionsItem>
      <NDescriptionsItem label="IP地址" :span="2">
        {{ props.data.ip }}
      </NDescriptionsItem>
      <NDescriptionsItem label="执行结果">
        <NTag :type="props.data.result ? 'error' : 'success'">
          {{ LOG_STATUS[props.data.result] }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem label="执行时间" :span="2">
        {{ formatTime(props.data.createTime, 'YYYY-MM-DD HH:mm') }}
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
</template>
