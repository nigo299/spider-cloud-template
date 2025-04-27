<template>
  <CommonPage>
    <template #action>
      <div class="flex items-center gap-12">
        <NButton type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" /> 新增示例
        </NButton>
        <NButton @click="handleExport">
          <i class="i-fe:download mr-4 text-16" /> 导出Excel
        </NButton>
      </div>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="900"
      :columns="columns as any"
      :get-data="api.read"
    >
      <MeQueryItem label="名称" :label-width="50">
        <n-input v-model:value="queryItems.name" type="text" placeholder="请输入名称" clearable />
      </MeQueryItem>
      <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="创建时间" :label-width="70">
        <n-date-picker
          v-model:value="queryItems.createdAt"
          type="daterange"
          clearable
          placeholder="请选择日期"
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="400px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <NSwitch v-model:value="modalForm.status"> </NSwitch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { NButton, NSwitch, NTag } from 'naive-ui'
import { h, ref } from 'vue'

// 假数据API模拟
let mockData = [
  { id: 1, name: '示例A', status: 1, createdAt: 1710000000000 },
  { id: 2, name: '示例B', status: 0, createdAt: 1711000000000 },
  { id: 3, name: '示例C', status: 1, createdAt: 1712000000000 },
]

const api = {
  async read(params: any) {
    let data = [...mockData]
    if (params.name) data = data.filter((i) => i.name.includes(params.name))
    if (params.status !== undefined && params.status !== null)
      data = data.filter((i) => i.status === params.status)
    if (params.createdAt && params.createdAt.length === 2) {
      const [start, end] = params.createdAt
      data = data.filter((i) => i.createdAt >= start && i.createdAt <= end)
    }
    return { data, total: data.length }
  },
  async create(row: any) {
    row.id = Date.now()
    mockData.unshift({ ...row })
    window.$message.success('新增成功（仅演示）')
    return { data: row }
  },
  async update(row: any) {
    const idx = mockData.findIndex((i) => i.id === row.id)
    if (idx > -1) mockData[idx] = { ...mockData[idx], ...row }
    window.$message.success('编辑成功（仅演示）')
    return { data: row }
  },
  async delete(id: string | number) {
    mockData = mockData.filter((i) => i.id !== id)
    window.$message.success('删除成功（仅演示）')
    return { data: id }
  },
  async batchDelete(ids: (string | number)[]) {
    mockData = mockData.filter((i) => !ids.includes(i.id))
    window.$message.success('批量删除成功（仅演示）')
    return { data: ids }
  },
  async enable(id: number, status: number) {
    const idx = mockData.findIndex((i) => i.id === id)
    if (idx > -1) mockData[idx].status = status
    window.$message.success('状态切换成功（仅演示）')
    return { data: id }
  },
}

defineOptions({ name: 'CrudDemo' })

interface DemoItem {
  id: number
  name: string
  status: number
  createdAt: number
}

interface QueryItem {
  name?: string
  status?: number
  createdAt?: [number, number]
}

const $table = ref<InstanceType<typeof MeCrud> | null>(null)
const queryItems = ref<QueryItem>({})
const checkedRowKeys = ref<(string | number)[]>([])

onMounted(() => {
  $table.value?.handleSearch()
})

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud<DemoItem>({
    name: '示例',
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    initForm: { status: 1 },
    refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
  })

const columns: DataTableColumns<DemoItem> = [
  { type: 'selection' },
  { title: '名称', key: 'name' },
  {
    title: '状态',
    key: 'status',
    render: (row: DemoItem) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: !!row.status,
          onUpdateValue: async () => await handleEnable(row),
        },
        {
          checked: () => '',
          unchecked: () => '停用',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createdAt',
    render: (row: DemoItem) =>
      h(NTag, { type: 'info' }, { default: () => new Date(row.createdAt).toLocaleString() }),
  },
  {
    title: '操作',
    key: 'actions',
    width: 300,
    align: 'right',
    fixed: 'right',
    render(row: DemoItem) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
        ),
      ]
    },
  },
]

async function handleEnable(row: DemoItem) {
  await api.enable(row.id, row.status ? 0 : 1)
  $table.value?.handleSearch(true)
}

function handleExport() {
  $table.value?.handleExport()
}
</script>
