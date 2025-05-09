import { type Ref, ref } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType } from '@/interface/table'

export const tableConfig: Ref<{
  rowKey: string
  pagination: {
    page: number
    pageSize: number
    itemCount: number
    pageSizes: string[]
    showSizePicker: boolean
    prefix: (info: { itemCount: number }) => string
  }
}> = ref({
  rowKey: 'id',
  pagination: {
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: ['10', '20', '50', '100'],
    showSizePicker: true,
    prefix: (info: { itemCount: number }) => `共 ${info.itemCount} 条`,
  },
})

const USE_STATUS_MAP: Record<string, string> = {
  0: '是',
  1: '否',
}
const USE_STATUS_TYPE_MAP: Record<string, string> = {
  0: 'success',
  1: 'error',
}

export const tableColumns: TableColumnAllType[] = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
    width: 70,
    type: TableColumnTypeEnum.INDEX,
  },
  {
    title: '角色名称',
    align: 'center',
    fixed: 'left',
    key: 'roleName',
    width: 130,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '创建人',
    key: 'createByUsername',
    align: 'center',
    width: 130,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    width: 150,
    type: TableColumnTypeEnum.DATE,
  },
  {
    title: '是否启用',
    key: 'status',
    align: 'center',
    width: 80,
    type: TableColumnTypeEnum.TAG,
    valueMap: USE_STATUS_MAP,
    typeMap: USE_STATUS_TYPE_MAP,
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    width: 180,
    type: TableColumnTypeEnum.TOOLTIP,
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.OPERATION,
  },
]
