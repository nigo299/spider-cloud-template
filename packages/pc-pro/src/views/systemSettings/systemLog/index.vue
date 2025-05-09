<script setup lang="ts">
import { AtCircleOutline } from '@vicons/ionicons5'
import { useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import dayjs from 'dayjs'
import { h, onMounted, ref, onActivated, onDeactivated, createVNode } from 'vue'
import { NButton, NPopover, NDivider, NModal, NDatePicker, NInput, NSelect } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import {
  abnormalEvents,
  alarmLogs,
  alarmsNumber,
  deleteLogs,
  exportLogs,
  getSystemLogsList,
  setAlarm,
  statisticsNumber,
} from '@/api/system/systemLogs'
import { MeCrud, MeQueryItem } from '@/components'
import type {
  LogsRecord,
  SiftLogsRecord,
  StatisticsParam,
  StatisticsResponse,
} from '@/interface/system/systemLogs'

import LogsDetailModal from './component/logsDetail.vue'
import StatisticsModal from './component/statistics.vue'
import WarningSettingModal from './component/warningSetting.vue'
import { LOG_STATUS } from './enum'

const formState = ref<SiftLogsRecord>({})
const queryItems = ref<{
  operationName: string | null
  account: string | null
  content: string | null
  result: number | null
  eventType: string | null
  eventCategory: string | null
  executeStartTime: number | null
  executeEndTime: number | null
  time: [number, number] | null
  pageNum: number
  pageSize: number
}>({
  operationName: null,
  account: null,
  content: null,
  result: null,
  eventType: null,
  eventCategory: null,
  executeStartTime: null,
  executeEndTime: null,
  time: null,
  pageNum: 1,
  pageSize: 10,
})
const selectList = ref<string[]>([])
const [exportLoading, exportLoadingToggle] = useToggle()
const logDetailData = ref<LogsRecord>({} as LogsRecord)
const [detailVisible, detailToggle] = useToggle()
const [deleteModalVisible, deleteModalVisibleToggle] = useToggle()
const customMessage = ref('您确定需要删除该条数据么？')
const customHint = ref('删除该条数据后将无法恢复，请谨慎操作。')
const deleteId = ref<string[]>([])
const deleteLoading = ref(false)
const refreshInterval = ref<any>(null)
const [warningSetting, warningSettingToggle] = useToggle()
const alarmsNum = ref(1)
const [statistics, statisticsToggle] = useToggle()
const statisticsparam = ref<StatisticsParam>({
  executeStartTime: null,
  executeEndTime: null,
})
const statisticsData = ref<StatisticsResponse[]>([])
const [statisticsLoading, statisticsLoadingToggle] = useToggle()
const $table = ref<any>(null)

// 定义表格列
const columns: DataTableColumns<LogsRecord> = [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'index',
    width: 70,
    render: (_, index) => index + 1,
  },
  {
    title: '姓名',
    key: 'operationName',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作账号',
    key: 'account',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '事件类型',
    key: 'eventType',
    width: 120,
  },
  {
    title: '事件分类',
    key: 'eventCategory',
    width: 120,
  },
  {
    title: '操作内容',
    key: 'content',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '请求地址',
    key: 'interfacePath',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '执行时长',
    key: 'duration',
    width: 100,
  },
  {
    title: 'IP地址',
    key: 'ip',
    width: 120,
  },
  {
    title: '执行结果',
    key: 'result',
    width: 100,
    render: (row) => {
      return h(
        'div',
        {
          class: row.result ? 'text-error' : 'text-success',
        },
        LOG_STATUS[row.result]
      )
    },
  },
  {
    title: '执行时间',
    key: 'createTime',
    width: 160,
    render: (row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (row) => {
      return [
        h(
          NButton,
          {
            type: 'primary',
            text: true,
            onClick: () => toEdit(row.id),
          },
          { default: () => '详情' }
        ),
        h(NDivider, { vertical: true }),
        h(
          NButton,
          {
            type: 'error',
            text: true,
            onClick: () => deleteInList([row.id]),
          },
          { default: () => '删除' }
        ),
      ]
    },
  },
]

// 适配器函数，将系统日志API响应转换为MeCrud需要的格式
const apiAdapter = async (params: any) => {
  const response = await getSystemLogsList(params)
  // MeCrud组件需要的格式是 {data: {pageData: [], total: number}} 或 {data: []}
  return {
    data: {
      pageData: response.list || [],
      total: response.total,
    },
  }
}

function handleSearch() {
  if (queryItems.value.time) {
    const startTime = dayjs(queryItems.value.time[0]).startOf('day').valueOf()
    const endTime = dayjs(queryItems.value.time[1]).endOf('day').valueOf()
    queryItems.value.executeStartTime = startTime
    queryItems.value.executeEndTime = endTime
  } else {
    queryItems.value.executeStartTime = null
    queryItems.value.executeEndTime = null
  }
  if ($table.value) {
    $table.value.handleSearch()
  }
}

function handleReset() {
  queryItems.value = {
    operationName: null,
    account: null,
    content: null,
    result: null,
    eventType: null,
    eventCategory: null,
    executeStartTime: null,
    executeEndTime: null,
    time: null,
    pageNum: 1,
    pageSize: 10,
  }
  if ($table.value) {
    $table.value.handleReset()
  }
}

function onChecked(keys: (string | number)[]) {
  selectList.value = keys.map((key) => String(key))
}

const toEdit = async (id: string) => {
  logDetailData.value = {} as LogsRecord
  // 先尝试从本地数据中查找
  if ($table.value && $table.value.tableData) {
    const record = $table.value.tableData.find((item: LogsRecord) => item.id === id)
    if (record) {
      logDetailData.value = record
      detailToggle()
      return
    }
  }

  // 如果本地找不到，则调用API单独获取
  const params = {
    id,
    pageNum: 1,
    pageSize: 10,
  }
  const response = await getSystemLogsList(params)
  if (response && response.list && response.list.length > 0) {
    logDetailData.value = response.list[0]
    detailToggle()
  } else {
    window.$message.error('获取日志详情失败')
  }
}

const closeDetailModal = () => {
  logDetailData.value = {} as LogsRecord
  detailToggle()
}

const cancelInDelModal = () => {
  deleteId.value = []
  selectList.value = []
  deleteModalVisibleToggle()
  deleteLoading.value = false
}

const handleDelete = async (value: string[]) => {
  deleteLoading.value = true
  const param = {
    ids: value,
  }
  const [, err] = await to(deleteLogs(param))

  if (!err) {
    window.$message.success('删除成功')
    if ($table.value) {
      $table.value.handleSearch()
    }
    deleteLoading.value = false
  } else {
    window.$message.error(err.message)
    deleteLoading.value = false
  }
  cancelInDelModal()
}

const deleteInList = (value: string[]) => {
  customMessage.value = '您确定需要删除该条数据么？'
  customHint.value = '删除该条数据后将无法恢复，请谨慎操作。'
  deleteModalVisibleToggle()
  deleteId.value = value
}

const batchDelete = () => {
  if (!selectList.value.length) {
    window.$message.warning('请先选择日志数据')
    return
  }
  customMessage.value = '您确定需要删除这些数据么？'
  customHint.value = '删除这些数据后将无法恢复，请谨慎操作。'
  deleteModalVisibleToggle()
}

const confirmInDelModal = () => {
  if (deleteId.value.length) handleDelete(deleteId.value)
  else handleDelete(selectList.value)
}

const exportDataList = async (type: 'all' | 'checked') => {
  if (type === 'checked' && !selectList.value.length) {
    window.$message.warning('请先选择日志数据')
    return
  }
  exportLoadingToggle()
  const param = {
    ids: type === 'all' ? [] : selectList.value,
  }
  const [data, err] = await to(exportLogs(param))

  if (!err) {
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = `${type === 'checked' ? '选中日志' : '全部日志'}.xlsx`
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    exportLoadingToggle()
    if (type === 'checked') selectList.value = []
  } else {
    exportLoadingToggle()
    window.$message.error(err.message)
  }
  selectList.value = []
}

const setWarningDays = async (data: number) => {
  if (data) {
    const param = {
      alarmCount: data,
    }
    const [, err] = await to(setAlarm(param))

    if (!err) {
      window.$message.success('设置成功')
      sessionStorage.setItem('overSizeWarning', '')
      warningSettingToggle(false)
    } else {
      window.$message.error(err.message)
    }
  } else {
    warningSettingToggle(false)
  }
}

const getAlarmNums = async () => {
  const [data, err] = await to(alarmsNumber())
  if (!err) alarmsNum.value = data.alarmCount
}

const getStatistics = async () => {
  statisticsLoadingToggle(true)
  const [data, err] = await to(statisticsNumber(statisticsparam.value))

  if (!err) {
    statisticsData.value = data
    statisticsLoadingToggle(false)
  } else {
    window.$message.error(err.message)
    statisticsLoadingToggle(false)
  }
}

const search = (val: StatisticsParam) => {
  statisticsparam.value = val
  getStatistics()
}

const openStatistic = () => {
  getStatistics()
  statisticsToggle(true)
}

const closeStatisticModal = () => {
  statisticsToggle(false)
  statisticsparam.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
}

onMounted(async () => {
  nextTick(() => {
    $table.value.handleSearch()
  })
  const overSizeWarning = sessionStorage.getItem('overSizeWarning')

  if (!overSizeWarning) {
    const [data, err] = await to(alarmLogs())

    if (!err) {
      if (data.status) {
        window.$dialog.warning({
          title: '警告',
          icon: () => h(AtCircleOutline),
          content: () => `当前系统的审计日志已超过${alarmsNum.value}条!`,
        })
        sessionStorage.setItem('overSizeWarning', 'after')
      }
    } else {
      window.$message.error(err.message)
    }
  }
})

const getAbnormalEvents = async () => {
  const [data, err] = await to(abnormalEvents())

  if (!err) {
    if (data) {
      window.$dialog.warning({
        title: '警告',
        icon: () => h(AtCircleOutline),
        content: () => `存在异常事件！${data}`,
      })
    }
  } else {
    window.$message.error(err.message)
  }
}

// 异常事件轮询
onActivated(() => {
  refreshInterval.value = setInterval(() => {
    getAbnormalEvents()
  }, 30000)
})

onDeactivated(() => {
  clearInterval(refreshInterval.value)
})

function onDataChange(data: any) {
  console.log('数据变更:', data)
}
</script>

<template>
  <CommonPage>
    <template #action>
      <div class="flex justify-end gap-12">
        <NButton @click="warningSettingToggle(true)">告警设置</NButton>
        <NButton type="error" @click="batchDelete()">批量删除</NButton>
        <NPopover trigger="click" placement="bottom-end">
          <template #trigger>
            <NButton :loading="exportLoading">
              {{ exportLoading ? '导出中' : '导出' }}
            </NButton>
          </template>
          <div class="p-2">
            <div class="cursor-pointer py-2 hover:text-primary" @click="exportDataList('checked')">
              导出选中数据
            </div>
            <div class="cursor-pointer py-2 hover:text-primary" @click="exportDataList('all')">
              导出全部数据
            </div>
          </div>
        </NPopover>
      </div>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns as any"
      :get-data="apiAdapter as any"
      @on-checked="onChecked"
      @on-data-change="onDataChange"
    >
      <MeQueryItem label="执行时间" :label-width="70">
        <NDatePicker
          v-model:value="queryItems.time"
          type="daterange"
          clearable
          placeholder="请选择日期"
        />
      </MeQueryItem>
      <MeQueryItem label="用户姓名" :label-width="70">
        <NInput
          v-model:value="queryItems.operationName"
          type="text"
          placeholder="请输入"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="操作账号" :label-width="70">
        <NInput v-model:value="queryItems.account" type="text" placeholder="请输入" clearable />
      </MeQueryItem>
      <MeQueryItem label="操作内容" :label-width="70">
        <NInput v-model:value="queryItems.content" type="text" placeholder="请输入" clearable />
      </MeQueryItem>
      <MeQueryItem label="执行结果" :label-width="70">
        <NSelect
          v-model:value="queryItems.result"
          clearable
          :options="[
            { label: '成功', value: 0 },
            { label: '失败', value: 1 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="事件类型" :label-width="70">
        <NSelect
          v-model:value="queryItems.eventType"
          clearable
          :options="[
            { label: '系统级', value: 'SYSTEM_LEVEL' },
            { label: '业务级', value: 'SERVICE_LEVEL' },
            { label: '外部接口级', value: 'EXTERNAL_LEVEL' },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="事件分类" :label-width="70">
        <NSelect
          v-model:value="queryItems.eventCategory"
          clearable
          :options="[
            { label: '正常事件', value: 'NORMAL_EVENT' },
            { label: '异常事件', value: 'ANOMALOUS_EVENT' },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <!-- 模态框组件 -->
    <LogsDetailModal :data="logDetailData" :visible="detailVisible" @close="closeDetailModal" />

    <!-- 确认删除对话框 -->
    <NModal
      v-model:show="deleteModalVisible"
      preset="dialog"
      type="warning"
      title="删除确认"
      :content="customMessage"
      positive-text="确定"
      negative-text="取消"
      :loading="deleteLoading"
      @positive-click="confirmInDelModal"
      @negative-click="cancelInDelModal"
    >
      <template #default>
        <div>{{ customMessage }}</div>
        <div class="text-gray-400 mt-2">{{ customHint }}</div>
      </template>
    </NModal>

    <WarningSettingModal
      :visible="warningSetting"
      :alarm-num="alarmsNum"
      @submit="setWarningDays"
    />
    <StatisticsModal
      :visible="statistics"
      :statistics-data="statisticsData"
      :loading="statisticsLoading"
      @cancel="closeStatisticModal"
      @search="search"
    />
  </CommonPage>
</template>
