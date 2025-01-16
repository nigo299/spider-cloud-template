<template>
  <template v-if="type === TableColumnTypeEnum.OPERATION">
    <a-space>
      <slot />
    </a-space>
  </template>

  <template v-else-if="type === TableColumnTypeEnum.INDEX">
    <span v-if="showPagination">
      {{ ((pagination?.current ?? 1) - 1) * (pagination?.pageSize ?? 10) + index + 1 }}
    </span>
    <span v-else>{{ index + 1 }}</span>
  </template>

  <template v-else-if="type === TableColumnTypeEnum.TEXT">
    {{ text }}
  </template>

  <template v-else-if="type === TableColumnTypeEnum.NUMBER">
    {{ text ?? 0 }}
  </template>

  <template v-else-if="type === TableColumnTypeEnum.TOOLTIP">
    <DynamicTooltip :width="column.width" :message="text" />
  </template>

  <template v-else-if="type === TableColumnTypeEnum.LINK">
    <div
      type="link"
      class="cursor-pointer text-blue-600"
      @click="$emit('link-click', record, column.dataIndex)"
    >
      {{ text }}
    </div>
  </template>

  <template v-else-if="type === TableColumnTypeEnum.TAG">
    <a-tag
      v-if="text !== null && text !== undefined"
      :color="column.typeMap?.[text]"
    >
      {{ column.valueMap?.[text] }}
    </a-tag>
    <span v-else>-</span>
  </template>

  <template v-else-if="type === TableColumnTypeEnum.SELECT">
    {{ column.valueMap?.[text] }}
  </template>

  <template v-else-if="type === TableColumnTypeEnum.DATE">
    <template v-if="text">
      {{ formatDate(text, column.format) }}
    </template>
    <span v-else>-</span>
  </template>

  <template v-else-if="type === TableColumnTypeEnum.ARRAY">
    {{ formatArray(text, column.separator) }}
  </template>

  <template v-else-if="type === TableColumnTypeEnum.SEX">
    <div>{{ +text ? '女' : '男' }}</div>
  </template>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { TableColumnAllType } from '@/interface/table'
import { TableColumnTypeEnum } from '@/enums'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

defineProps<{
  column: TableColumnAllType
  text: any
  record: Record<string, any>
  index: number
  type: TableColumnTypeEnum
  pagination?: TablePaginationConfig
  showPagination?: boolean
}>()

defineEmits<{
  (e: 'link-click', record: any, dataIndex?: string | string[]): void
}>()

const formatDate = (value: number | string, format?: string) => {
  return format ? dayjs(+value).format(format) : dayjs(+value).format('YYYY-MM-DD')
}

const formatArray = (arr?: any[], separator?: string) => {
  return arr?.join(separator ?? ',')
}
</script>
