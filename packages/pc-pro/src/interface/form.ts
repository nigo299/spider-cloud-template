import type { TreeSelectProps, FormItemRule, DatePickerProps } from 'naive-ui'
import type { Dayjs } from 'dayjs'

import type { FormColumnTypeEnum } from '@/enums'

import type { CommonListType } from '.'

export interface FormConfigType {
  layout?: string
  labelCol?: Record<string, any>
  row?: Record<string, any>
  col?: Record<string, any>
  rules?: Record<string, FormItemRule[]>
  isEmbedded?: boolean
  hasValidator?: boolean
}

export interface FormColumnType {
  label: string
  field: string
  type: FormColumnTypeEnum
  placeholder?: string | string[]
  options?: CommonListType[]
  disabled?: boolean
  name?: string
  rules?: FormItemRule | FormItemRule[]
  picker?: DatePickerProps['type']
  valueFormat?: string
  showTime?: boolean | Record<string, any>
  disabledDate?: (current: Dayjs) => boolean
  format?: string
  maxCount?: number
  max?: number
  readonly?: boolean
  multiple?: boolean
  span?: Record<string, any>
  /**
   * @name 字段宽度
   * @description 传响应式col
   */
  col?: object
  fieldNames?: object
  /**
   *@description date组件时间格式，可设置00:00:00和59:59:59，分别对应start和end
   */
  beginWidth?: string // 'start' | 'end'
  /** 是否隐藏form-item */
  hidden?: boolean
  /** 树形选择器数据 */
  treeData?: TreeSelectProps['options']
}
