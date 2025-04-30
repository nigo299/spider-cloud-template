<script setup lang="ts">
import { to, NotRevalidateOption } from '@/utils/to'
import useSWRV from 'swrv'
import { ref, h } from 'vue'
import { DataTableColumns, NButton, NSpace, NTag } from 'naive-ui'

import { deleteMenu, getMenuList } from '@/api/system/menuManage'
import type { IMenuTreeRecord } from '@/interface/system/menuManage'

import AddOrEditModal from './addOrEditModal.vue'
import { formColumns } from './config/editFormConfig'
import { MENU_TYPE_STATUS, MENU_TYPE_TAG_STATUS } from './config/tableConfig'

const modalRef = ref<InstanceType<typeof AddOrEditModal>>()

const initData = async () => {
  const [data, error] = await to(getMenuList())

  if (error) {
    window.$message.error(error.message)
    return
  }

  function formatMenu(list: IMenuTreeRecord[]) {
    list.forEach((item) => {
      item.children = item.items
      const { sortNumber, permissionType, code, path } = item.self
      Object.assign(item, { sortNumber, permissionType, code, path })

      if (item.hasChildren) formatMenu(item.items)
    })
  }
  formatMenu(data)
  const parentIndex = formColumns.value.findIndex((item) => item.field === 'parentId')
  // 添加类型断言，确保类型兼容
  formColumns.value[parentIndex].treeData = [
    ...data,
    { name: '主目录', id: null, parentId: null },
  ] as any
  return data
}

const {
  data: dataSource,
  isValidating: loading,
  mutate: getList,
} = useSWRV(() => '[menu-list]', initData, NotRevalidateOption)

function toEdit(row: IMenuTreeRecord) {
  modalRef.value?.showModal(true, row)
}

function toAdd(row?: IMenuTreeRecord) {
  modalRef.value?.showModal(false, row)
}

async function toDelete(id: string) {
  const [, err] = await to(deleteMenu(id))

  if (!err) {
    window.$message.success('删除成功！')
    getList()
  } else {
    window.$message.error(err.message)
  }
}

// 转换列配置为Naive UI格式
const columns = ref([
  {
    title: '菜单名称',
    key: 'name',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
  },
  {
    title: '排序',
    key: 'sortNumber',
    align: 'center',
    ellipsis: true,
    width: 120,
  },
  {
    title: '请求地址',
    key: 'path',
    align: 'center',
    width: 120,
  },
  {
    title: '类型',
    key: 'permissionType',
    align: 'center',
    width: 100,
    render(row: IMenuTreeRecord) {
      const type = row.permissionType
      const tagType = MENU_TYPE_TAG_STATUS[type]
      return h(
        NTag,
        {
          type: tagType === 'success' ? 'success' : tagType === 'processing' ? 'info' : 'default',
          size: 'small',
        },
        { default: () => MENU_TYPE_STATUS[type] || '-' }
      )
    },
  },
  {
    title: '权限标识',
    key: 'code',
    align: 'center',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 150,
    render(row: IMenuTreeRecord) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => toAdd(row),
              },
              { default: () => '新增' }
            ),
            h(
              NButton,
              {
                size: 'small',
                text: true,
                type: 'primary',
                onClick: () => toEdit(row),
              },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                size: 'small',
                text: true,
                type: 'error',
                onClick: () => toDelete(row.id as string),
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
  <n-layout class="h-full">
    <n-card class="h-full">
      <div class="flex justify-between py-2 mb-4">
        <n-button type="primary" @click="toAdd()"> 新增主目录 </n-button>
      </div>
      <n-data-table
        :columns="columns as unknown as DataTableColumns<IMenuTreeRecord>"
        :data="dataSource ? dataSource : []"
        :loading="loading"
        :single-line="false"
        :bordered="true"
      />
    </n-card>
    <AddOrEditModal ref="modalRef" @refresh="getList" />
  </n-layout>
</template>
