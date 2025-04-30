<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref, h } from 'vue'
import { NButton, NDivider, NTag, NSpace, NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

import { customDelay, customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import DynamicTooltip from '@/components/DynamicTooltip.vue'
import type { TablePageChange } from '@/interface/system/roleManage'
import type { LogsRecord } from '@/interface/system/systemLogs'
import { formatExecuteTime, formatTime } from '@/utils/format'

import { LOG_STATUS, LOG_TAG_STATUS } from '../enum'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },

  dataSource: {
    type: Array,
    default: () => [],
  },
  selectList: {
    type: Array<string>,
    default: () => [],
  },
  paginationParam: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['pageChange', 'select', 'delete', 'toedit'])
const requestCellWidth = ref(150)

const logsTable = ref(null)
const { height } = useElementSize(logsTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.logsAndRole
})

function rowSelection(selectedRowKeys: string[]) {
  emits('select', selectedRowKeys)
}

function handleTableChange(currentPage: number, pageSize: number) {
  emits('pageChange', { current: currentPage, size: pageSize })
}

const pagination = computed(() => ({
  page: props.paginationParam.pageNum,
  pageSize: props.paginationParam.pageSize,
  itemCount: props.total,
  showSizePicker: true,
  pageSizes: customPaginationOptions.pageSizeOptions?.map(Number) || [10, 20, 30, 50],
  onChange: (page: number) => handleTableChange(page, props.paginationParam.pageSize),
  onUpdatePageSize: (size: number) => handleTableChange(1, size),
}))

function deleteLog(id: string) {
  emits('delete', [id])
}

function openInfoModal(id: string) {
  emits('toedit', id)
}

// 判断是否有删除权限
const hasDeletePermission = ref(true) // 假设默认有权限，实际应该从权限系统获取

// 行属性处理函数
function rowProps(row: LogsRecord) {
  return {
    style: props.selectList.includes(row.id) ? 'background-color: rgba(237, 242, 247, 0.65);' : '',
    onClick: () => {
      if (props.selectList.includes(row.id)) {
        emits(
          'select',
          props.selectList.filter((id) => id !== row.id)
        )
      } else {
        emits('select', [...props.selectList, row.id])
      }
    },
  }
}

// 将列配置转换为Naive UI格式
const columns = computed<DataTableColumns<LogsRecord>>(() => [
  {
    title: '序号',
    key: 'index',
    width: 50,
    fixed: 'left',
    align: 'center',
    render: (row, index) =>
      index + 1 + (props.paginationParam.pageNum - 1) * props.paginationParam.pageSize,
  },
  {
    title: '姓名',
    key: 'operationName',
    width: 120,
    ellipsis: true,
    fixed: 'left',
    render: (row) => h(DynamicTooltip, { width: 120, message: row.operationName }),
  },
  {
    title: '操作账号',
    key: 'account',
    ellipsis: true,
    width: 120,
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
    ellipsis: true,
    width: requestCellWidth.value,
    render: (row) => h(DynamicTooltip, { width: requestCellWidth.value, message: row.content }),
  },
  {
    title: '请求地址',
    key: 'interfacePath',
    ellipsis: true,
    width: requestCellWidth.value,
    render: (row) =>
      h(DynamicTooltip, {
        width: requestCellWidth.value,
        message: row.interfacePath?.substring(1),
      }),
  },
  {
    title: '执行时长',
    key: 'duration',
    width: 100,
    render: (row) => formatExecuteTime(row.duration),
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
      const type = LOG_TAG_STATUS[row.result] === 'success' ? 'success' : 'error'
      return h(NTag, { type }, { default: () => LOG_STATUS[row.result] })
    },
  },
  {
    title: '执行时间',
    key: 'createTime',
    width: 160,
    render: (row) => formatTime(row.createTime, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150,
    fixed: 'right',
    render: (row) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                text: true,
                type: 'primary',
                onClick: () => openInfoModal(row.id),
              },
              { default: () => '详情' }
            ),
            h(NDivider, {
              vertical: true,
              style: { display: hasDeletePermission.value ? 'inline-block' : 'none' },
            }),
            h(
              NButton,
              {
                text: true,
                type: 'error',
                style: { display: hasDeletePermission.value ? 'inline-block' : 'none' },
                onClick: () => deleteLog(row.id),
              },
              { default: () => '删除' }
            ),
          ],
        }
      )
    },
  },
])
</script>

<template>
  <div ref="logsTable" class="h-[calc(100%-40px)]">
    <NDataTable
      size="small"
      class="bg-[#fff] py-[10px] radius-5"
      :columns="columns"
      :data="dataSource as LogsRecord[]"
      :bordered="true"
      :loading="loading"
      :row-key="(row: LogsRecord) => row.id"
      :scroll-x="1000"
      :max-height="scrollHeight"
      :pagination="pagination"
      :row-props="rowProps"
    />
  </div>
</template>
