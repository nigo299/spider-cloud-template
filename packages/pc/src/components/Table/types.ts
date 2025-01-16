import type { TableProps } from 'ant-design-vue/es/table/Table'
import type {
  FilterValue,
  Key,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
  TableRowSelection,
} from 'ant-design-vue/es/table/interface'
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface'
import type { TableColumnAllType } from '@/interface/table'

export interface TablePropsType {
  data: any[]
  columns: TableColumnAllType[]
  config?: TableProps
  loading?: boolean
  selectList?: Key[]
}

export interface TableEmitsType {
  (e: 'update:selectList', keys: Key[]): void
  (e: 'change', pagination: TablePaginationConfig, filters: Record<string, FilterValue>, 
   sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>): void
  (e: 'selectChange', selectedRows: any[]): void
  (e: 'linkChange', row: any, key?: DataIndex): void
  (e: 'rowClick', row: any): void
}
