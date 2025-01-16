<script setup lang="ts">
import { type ComputedRef, computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Key, TableRowSelection } from 'ant-design-vue/es/table/interface'
import { DownOutlined, RightOutlined } from '@ant-design/icons-vue'
import TableCell from './components/TableCell.vue'
import type { TablePropsType, TableEmitsType } from './types'
import { tableDefaultConfig } from './tableDefaultConfig'

const props = withDefaults(defineProps<TablePropsType>(), {
  config: undefined,
  data: () => [],
  columns: () => [],
  selectList: () => [],
})

const emit = defineEmits<TableEmitsType>()
const slots = defineSlots()

// 状态管理
const selectList = ref(props.selectList)
const expandedRowKeys = ref<string[]>([])

// 计算属性
const data = computed(() => props.data)
const config = computed(() => Object.assign({}, tableDefaultConfig, props.config))
const loading = computed(() => props.loading)

// 选择相关逻辑
const handleSelectChange = (selectedRowKeys: Key[], selectedRows: any) => {
  if (config.value.rowSelection?.type === 'radio') selectList.value = selectedRowKeys
  emit('update:selectList', selectList.value)
  emit('selectChange', selectedRows)
}

const handleAllChange = (selected: boolean, selectedRows: any, changeRows: any[]) => {
  const rowKey = config.value.rowKey!
  if (!selected) {
    selectList.value = selectList.value!.filter(
      (selectItem) => !changeRows.some((changeItem) => changeItem[rowKey] === selectItem),
    )
  } else {
    changeRows.forEach((arr: any) => {
      selectList.value!.push(arr[rowKey])
    })
  }
  emit('update:selectList', selectList.value)
}

const handleRowChange = (record: any) => {
  const rowKey = config.value.rowKey!
  const index = selectList.value!.indexOf(record[rowKey])
  if (index !== -1) selectList.value!.splice(index, 1)
  else selectList.value!.push(record[rowKey])
  emit('update:selectList', selectList.value)
}

// 表格配置
const selection: ComputedRef<TableRowSelection<any> | undefined> = computed(() => {
  if (props.config?.rowSelection !== null) {
    return {
      ...tableDefaultConfig.rowSelection,
      ...props.config?.rowSelection,
      selectedRowKeys: selectList.value,
      onChange: handleSelectChange,
      onSelectAll: handleAllChange,
      onSelect: handleRowChange,
    }
  }
  return undefined
})

// 事件处理
const handlePaginationChange = (pagination: any, filters: any, sorter: any, extra: any) => {
  if (typeof config.value.pagination !== 'boolean') {
    if (config.value.pagination!.pageSize !== pagination.pageSize) pagination.current = 1
    config.value.pagination!.current = pagination.current
    config.value.pagination!.pageSize = pagination.pageSize
  }
  emit('change', pagination, filters, sorter, extra)
}

const handleRowClick = (row: any) => {
  emit('rowClick', row)
}

const handleLinkClick = (row: any, key?: any) => {
  emit('linkChange', row, key)
}

const handleExpand = (expanded: boolean, record: any) => {
  if (expanded) expandedRowKeys.value.push(record.id)
  else expandedRowKeys.value = expandedRowKeys.value.filter((item) => item !== record.id)
}

// 监听器
watch(
  () => props.selectList,
  (val) => {
    selectList.value = val
  },
  {
    deep: true,
    immediate: true,
  },
)

// 生命周期
onBeforeUnmount(() => {
  if (config.value.pagination) {
    config.value.pagination!.current = 1
    config.value.pagination!.pageSize = 10
  }
})
</script>

<template>
  <div class="w-full">
    <div v-if="slots.header" class="mb-4">
      <slot name="header" />
    </div>
    <a-table
      v-bind="config"
      :data-source="data"
      :columns="props.columns"
      :loading="loading"
      :expanded-row-keys="expandedRowKeys"
      :row-selection="selection"
      :custom-row="
        (record: any) => ({
          onClick: () => handleRowClick(record),
        })
      "
      @change="handlePaginationChange"
      @expand="handleExpand"
    >
      <template #expandIcon="{ expanded, record, onExpand }">
        <span v-if="record.children?.length" class="float-left ml-4 cursor-pointer">
          <DownOutlined v-if="expanded" @click="(e: MouseEvent) => onExpand(record, e)" />
          <RightOutlined v-else @click="(e: MouseEvent) => onExpand(record, e)" />
        </span>
        <span v-else class="float-left ml-4 w-22px h-14px" />
      </template>

      <template #bodyCell="{ column, record, text, index }">
        <TableCell
          :column="column"
          :record="record"
          :text="text"
          :index="index"
          :type="column.type"
          :pagination="typeof config.pagination === 'object' ? config.pagination : undefined"
          :show-pagination="!!config.pagination"
          @link-click="handleLinkClick"
        >
          <slot v-if="column.type === 'operation'" :row="record" />
        </TableCell>
      </template>
    </a-table>
  </div>
</template>
