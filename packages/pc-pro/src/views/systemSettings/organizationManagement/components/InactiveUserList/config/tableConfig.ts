import { type Ref, ref } from 'vue'
import type { DataTableColumn, PaginationProps } from 'naive-ui'

import type { TableConfigType } from '@/interface/table'

export const tableConfig: Ref<TableConfigType> = ref({
  scroll: {
    x: '100%',
    y: '45vh',
    scrollToFirstRowOnChange: true,
  },
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  },
})

// 分页配置
export const paginationConfig = ref<PaginationProps>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
  prefix: (info) => `共 ${info.itemCount} 条`,
})

// 表格配置
export const tableColumns = ref<DataTableColumn[]>([
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
    width: 70,
    render: (_, index) => {
      const page = paginationConfig.value?.page || 1
      const pageSize = paginationConfig.value?.pageSize || 10
      return index + 1 + (page - 1) * pageSize
    },
  },
  {
    title: '姓名',
    key: 'name',
    align: 'center',
    fixed: 'left',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'i国网账号',
    key: 'account',
    align: 'center',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '所属组织',
    key: 'orgTreePathName',
    align: 'center',
    width: 130,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '角色名称',
    key: 'roleName',
    align: 'center',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    width: 100,
  },
  {
    title: '有限期',
    key: 'validDate',
    align: 'center',
    width: 130,
  },
  {
    title: '最后登录时间',
    key: 'lastLoginDate',
    align: 'center',
    width: 130,
    fixed: 'right',
  },
])
