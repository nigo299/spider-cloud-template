<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import dayjs from 'dayjs'
import { ref, watch, h } from 'vue'
import { NModal, NButton, NSpace, NDataTable, NDatePicker } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import { customDelay } from '@/common/js/config'
import type { StatisticsParam, StatisticsResponse } from '@/interface/system/systemLogs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  statisticsData: {
    type: Array as () => StatisticsResponse[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['close', 'search'])
const dateRange = ref<[number, number] | null>(null)
const [countVisible, countToggle] = useToggle()
const param = ref<StatisticsParam>({
  executeStartTime: null,
  executeEndTime: null,
})

watch(
  () => props.visible,
  (val) => {
    countToggle(val)
  }
)

function handleCancel() {
  dateRange.value = null
  param.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
  countToggle(false)
  emits('close')
}

function onChange(val: [number, number] | null) {
  if (val) {
    dateRange.value = val
    param.value.executeStartTime = dayjs(new Date(val[0])).startOf('day').valueOf()
    param.value.executeEndTime = dayjs(new Date(val[1])).endOf('day').valueOf()
  } else {
    dateRange.value = null
    param.value.executeStartTime = null
    param.value.executeEndTime = null
  }
}

function reset() {
  dateRange.value = null
  param.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
  emits('search', param.value)
}

function submit() {
  emits('search', param.value)
}

// 定义表格列
const columns: DataTableColumns<StatisticsResponse> = [
  {
    title: '序号',
    key: 'index',
    width: 50,
    render: (_, index) => index + 1,
  },
  {
    title: '姓名',
    key: 'operationName',
    width: 80,
  },
  {
    title: '操作账号',
    key: 'account',
    width: 100,
  },
  {
    title: '成功登录次数',
    key: 'successfulLoginNum',
    width: 120,
  },
  {
    title: '失败登录次数',
    key: 'failedLoginNum',
    width: 120,
  },
]
</script>

<template>
  <div>
    <NModal
      v-model:show="countVisible"
      title="统计"
      :mask-closable="false"
      style="width: 50%"
      preset="card"
      @close="handleCancel"
    >
      <div class="flex justify-between mb-2">
        <div>
          执行时间：
          <NDatePicker
            type="daterange"
            clearable
            :value="dateRange"
            format="yyyy-MM-dd"
            @update:value="onChange"
          />
        </div>
        <NSpace>
          <NButton type="primary" ghost size="small" class="mr-[7px]" @click="submit">
            查询
          </NButton>
          <NButton type="primary" text size="small" @click="reset"> 重置 </NButton>
        </NSpace>
      </div>
      <NDataTable
        size="small"
        :bordered="true"
        :columns="columns"
        :data="props.statisticsData"
        :pagination="false"
        :loading="props.loading"
        :max-height="400"
      />
    </NModal>
  </div>
</template>
