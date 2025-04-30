<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { NotRevalidateOption } from '@/utils/to'
import useSWRV from 'swrv'
import { computed, watch } from 'vue'

import { inactiveUser } from '@/api/system/organization'

import { paginationConfig, tableColumns } from './config/tableConfig'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'export'])

const [dialogVis, dialogVisChange] = useToggle(false)

const { data: dataSource, isValidating: loading } = useSWRV(
  () => 'inactive-user-list',
  () => inactiveUser(),
  NotRevalidateOption
)

// 计算绑定到分页的属性
const pagination = computed(() => {
  return {
    ...paginationConfig.value,
    itemCount: dataSource.value?.length || 0,
  }
})

watch(
  () => props.modelValue,
  (val) => {
    dialogVisChange(val)
  }
)

function handleCancel() {
  dialogVisChange(false)
  emit('update:modelValue', false)
}
</script>

<template>
  <n-modal
    v-model:show="dialogVis"
    title="不活跃成员"
    style="width: 60%"
    preset="card"
    @close="handleCancel"
  >
    <div class="mb-4">
      <n-button type="primary" @click="emit('export')">导出</n-button>
    </div>
    <n-data-table
      :columns="tableColumns"
      :data="dataSource || []"
      :loading="loading"
      :pagination="pagination"
      :bordered="true"
      size="small"
    />
  </n-modal>
</template>
