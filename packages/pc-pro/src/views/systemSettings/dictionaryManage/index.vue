<template>
  <CommonPage>
    <template #action>
      <div class="flex items-center gap-12">
        <NButton type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" /> 新增字典
        </NButton>
      </div>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="900"
      :columns="columns"
      :get-data="getData"
    >
      <MeQueryItem label="字典名称" :label-width="70">
        <n-input
          v-model:value="queryItems.dictName"
          type="text"
          placeholder="请输入字典名称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="字典类型" :label-width="70">
        <n-input
          v-model:value="queryItems.dictType"
          type="text"
          placeholder="请输入字典类型"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '正常', value: 0 },
            { label: '停用', value: 1 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <AddOrEditModal ref="modalRef" @refresh="$table?.handleSearch()" />
  </CommonPage>
</template>

<script setup lang="ts">
import { NotRevalidateOption, to } from '@/utils/to'
import { h, onMounted, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import { CommonPage, MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

import { deleteDictionary, getDictionaryList } from '@/api/system/dictionary'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'
import { router } from '@/router'

import AddOrEditModal from './addOrEditModal.vue'

// 查询参数
const queryItems = ref({
  dictName: '',
  dictType: '',
  status: null as number | null,
  pageNum: 1,
  pageSize: 10,
})

const $table = ref<InstanceType<typeof MeCrud> | null>(null)

// 数据获取函数
async function getData(params: any) {
  try {
    const result = await getDictionaryList({
      ...params,
      pageNum: params.pageNo || 1,
      pageSize: params.pageSize || 10,
    })
    return {
      data: {
        pageData: result?.data?.list || [],
        total: result?.data?.total || 0,
      },
    }
  } catch (error) {
    console.error('获取字典列表失败:', error)
    return { data: { pageData: [], total: 0 } }
  }
}

// 表格列定义
const columns: DataTableColumns<any> = [
  {
    title: '序号',
    key: 'index',
    render: (_, index) => index + 1,
    width: 70,
  },
  {
    title: '字典名称',
    key: 'dictName',
    width: 120,
  },
  {
    title: '字典类型',
    key: 'dictType',
    width: 120,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 0 ? 'success' : 'error',
        },
        { default: () => (row.status === 0 ? '正常' : '停用') }
      )
    },
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160,
  },
  {
    title: '备注',
    key: 'remark',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            style: 'margin-right: 10px;',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            text: true,
            style: 'margin-right: 10px;',
            onClick: () => toDetail(row.id),
          },
          { default: () => '数据列表' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            text: true,
            onClick: () => handleDelete(row.id),
          },
          { default: () => '删除' }
        ),
      ]
    },
  },
]

// 使用CRUD hook
const { modalRef, handleAdd, handleEdit, handleDelete } = useCrud<IDictionaryAddOrEditParams>({
  name: '字典',
  doDelete: async (id) => {
    await deleteDictionary(id as string)
    return { success: true }
  },
  refresh: () => $table.value?.handleSearch(),
})

// 跳转到字典数据列表
const toDetail = (id: string) => {
  router.push({ path: '/system-settings/dictionary-data', query: { id } })
}

onMounted(() => {
  $table.value?.handleSearch()
})
</script>
