<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref, h } from 'vue'

import { customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import DynamicTooltip from '@/components/DynamicTooltip.vue'
import { ROLE_TYPE } from '@/interface/system/roleManage'
import type { RoleListInfo } from '@/interface/system/roleManage'
import { formatTime } from '@/utils/format'
import type { PaginationProps } from 'naive-ui'

interface Column {
  title: string
  key: string
  align?: 'left' | 'center' | 'right'
  width?: number
  ellipsis?: boolean
  render?: (row: RoleListInfo, index: number) => any
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageNum: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  dataSource: {
    type: Array<RoleListInfo>,
    default: () => [],
  },
  selectList: {
    type: Array<string>,
    default: () => [],
  },
})
const emits = defineEmits(['pageChange', 'select', 'delete', 'toedit'])
const remarkCellWidth = ref(300)
const columns: Column[] = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 50,
    render: (_, index) => index + 1 + (props.pageNum - 1) * props.pageSize,
  },
  {
    title: '名称',
    key: 'roleName',
  },
  {
    title: '备注',
    key: 'remark',
    ellipsis: true,
    width: remarkCellWidth.value,
    render: (row) => {
      return h(DynamicTooltip, {
        width: remarkCellWidth.value,
        message: row.remark ?? '',
      })
    },
  },
  {
    title: '创建者',
    key: 'createByUsername',
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => formatTime(Number(row.createTime ?? 0), 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => {
      const buttons = []

      if (row.roleType === ROLE_TYPE.system) {
        buttons.push(
          h(
            'n-button',
            {
              text: true,
              type: 'primary',
              class: 'px-0',
              onClick: () => openInfoModal(String(row.id ?? '')),
            },
            { default: () => '查看' }
          )
        )
      } else {
        const permissions = sessionStorage.getItem('permissions') || '[]'
        const permList = JSON.parse(permissions)

        if (permList?.includes('button_contact_role_edit')) {
          buttons.push(
            h(
              'n-button',
              {
                text: true,
                type: 'primary',
                class: 'px-0',
                onClick: () => openInfoModal(String(row.id ?? '')),
              },
              { default: () => '编辑' }
            )
          )
        }

        if (permList?.includes('button_contact_role_delete')) {
          if (buttons.length > 0) {
            buttons.push(
              h('n-divider', {
                vertical: true,
              })
            )
          }

          buttons.push(
            h(
              'n-button',
              {
                text: true,
                type: 'error',
                class: 'px-0 ml-5px',
                disabled: row.roleType === (ROLE_TYPE.system as any),
                onClick: () => handleDelete(String(row.id ?? '')),
              },
              { default: () => '删除' }
            )
          )
        }
      }

      return h('div', { class: 'flex items-center gap-2' }, buttons)
    },
  },
]
const roleTable = ref(null)
const { height } = useElementSize(roleTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.logsAndRole
})

function roleSelection(selectedRowKeys: (string | number)[]) {
  emits('select', selectedRowKeys as string[])
}

function handleTableChange(page: number, pageSize: number) {
  emits('pageChange', { current: page, size: pageSize })
}

const pagination = computed(() => {
  return {
    page: props.pageNum,
    pageSize: props.pageSize,
    itemCount: props.total,
    pageSizes: customPaginationOptions.pageSizeOptions?.map(Number) || [10, 20, 50, 100],
    showSizePicker: true,
    prefix({ itemCount }: { itemCount: number }) {
      return `共 ${itemCount} 条`
    },
    onUpdatePage(page: number) {
      handleTableChange(page, props.pageSize)
    },
    onUpdatePageSize(size: number) {
      handleTableChange(1, size)
    },
  } as PaginationProps
})

function handleDelete(id: string) {
  emits('delete', [id])
}

async function openInfoModal(id: string) {
  emits('toedit', id)
}

function dividerVisible(type: number) {
  const permissions = sessionStorage.getItem('permissions') || '[]'
  const list = JSON.parse(permissions)

  if (type === 1) {
    return list?.includes('button_contact_role_delete')
  } else {
    return ['button_contact_role_edit', 'button_contact_role_delete'].every((val) =>
      list?.includes(val)
    )
  }
}
</script>

<template>
  <div ref="roleTable" class="h-[calc(100%-40px)]">
    <n-data-table
      size="small"
      class="bg-white my-3"
      :columns="columns"
      :data="dataSource"
      :bordered="true"
      :max-height="scrollHeight"
      :loading="loading"
      :row-key="(row) => String(row.id)"
      :pagination="pagination"
      :checked-row-keys="props.selectList"
      @update:checked-row-keys="roleSelection"
    />
  </div>
</template>

<style lang="less" scoped></style>
