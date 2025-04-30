import type { DataTableProps, DataTableColumn, DataTableBaseColumn } from 'naive-ui'

import type { TableColumnTypeEnum } from '@/enums'

// 定义CreateRowKey类型以匹配Naive UI
type CreateRowKey<T = any> = (rowData: T, rowIndex: number) => string | number

export interface TableConfigType extends Omit<DataTableProps, 'columns' | 'rowKey'> {
  columns?: DataTableColumn[]
  rowKey?: string | CreateRowKey
  bordered?: boolean
  loading?: boolean
  pagination?: {
    page?: number
    pageSize?: number
    itemCount?: number
    pageCount?: number
    showSizePicker?: boolean
    pageSlot?: number
    onUpdatePage?: (page: number) => void
    onUpdatePageSize?: (pageSize: number) => void
    pageSizes?: number[]
  }
  scroll?: {
    x?: number | string
    y?: number | string
  }
  rowSelection?: {
    selectedRowKeys?: Array<string | number>
    selectedRows?: Array<any>
    onChange?: (selectedRowKeys: Array<string | number>, selectedRows: Array<any>) => void
  }
  sticky?:
    | boolean
    | {
        offsetTop?: number
        offsetBottom?: number
        getContainer?: () => HTMLElement
      }
  isChildren?: boolean
}

export interface TableColumnExtendType {
  type?: TableColumnTypeEnum
  valueMap?: Record<string, any>
  typeMap?: Record<string, string>
  separator?: string
  format?: string
  field?: string[]
}

export type TableColumnAllType = DataTableBaseColumn & TableColumnExtendType
