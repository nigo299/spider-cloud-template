<script setup lang="ts">
import { to } from '@/utils/to'

import dayjs from 'dayjs'
import { ref, h, onMounted } from 'vue'
import { NTag, NButton, NTooltip } from 'naive-ui'

import { deleteRole, getRoleList } from '@/api/system/roleManage'
import { MeCrud, MeQueryItem } from '@/components'
import type { IRoleList } from '@/interface/system/organization'

import AddOrEditModal from './component/addRole.vue'

interface SearchFormStateFixed {
  roleName?: string
  createByUsername?: string
  status?: number
  time: [number, number] | null
  startTime?: number | null
  endTime?: number | null
}

const addModalRef = ref<InstanceType<typeof AddOrEditModal>>()
const crudRef = ref<any>()
const searchParam = ref<SearchFormStateFixed>({ time: null })
const selectList = ref<(string | number)[]>([])

onMounted(() => {
  crudRef.value?.handleSearch()
})

function handleSearchParams(params: any) {
  // 处理时间区间
  if (Array.isArray(params.time) && params.time.length === 2) {
    const [start, end] = params.time
    params.startTime = dayjs(start).startOf('day').valueOf()
    params.endTime = dayjs(end).endOf('day').valueOf()
  } else {
    params.startTime = null
    params.endTime = null
  }
  return params
}

// 重置搜索条件
function resetSearchParam() {
  // 使用Object.assign而不是直接赋值
  Object.keys(searchParam).forEach((key) => {
    delete searchParam[key as keyof SearchFormStateFixed]
  })
  Object.assign(searchParam, { time: null })
  crudRef.value?.handleSearch()
}

async function getData(params: any) {
  const query = handleSearchParams({ ...params })
  const res = await getRoleList({
    ...query,
    pageNum: query.page || 1,
    pageSize: query.pageSize || 10,
  })
  const list = res.list ?? []
  return {
    data: Object.assign([...list], {
      pageData: list,
      total: res.total ?? 0,
      length: list.length,
    }),
  }
}

async function clickDeleteEvent(id: string | number) {
  const [, err] = await to(deleteRole({ ids: [String(id)] }))
  if (!err) {
    window.$message?.success('删除成功')
    crudRef.value?.handleSearch()
  } else {
    window.$message?.error(err.message)
  }
}

async function clickBatchDeleteEvent() {
  if (selectList.value.length) {
    const [, err] = await to(deleteRole({ ids: selectList.value.map(String) }))
    if (!err) {
      window.$message?.success('删除成功')
      selectList.value = []
      crudRef.value?.handleSearch()
    } else {
      window.$message?.error(err.message)
    }
  } else {
    window.$message?.warning('请先选择需要删除的数据')
  }
}

async function addOrEditEvent(isEdit: boolean, id?: string) {
  addModalRef.value?.showModal(isEdit, id)
}

const columns = [
  { type: 'selection', key: 'selection' },
  {
    title: '序号',
    key: 'index',
    width: 70,
    render: (_row: IRoleList, index: number) => index + 1,
  },
  {
    title: '角色名称',
    key: 'roleName',
    width: 130,
  },
  {
    title: '创建人',
    key: 'createByUsername',
    width: 130,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 150,
    render: (row: IRoleList) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '是否启用',
    key: 'status',
    width: 80,
    render: (row: IRoleList) =>
      h(
        NTag,
        {
          type: row.status === 0 ? 'success' : 'error',
          size: 'small',
          bordered: false,
        },
        { default: () => (row.status === 0 ? '是' : '否') }
      ),
  },
  {
    title: '备注',
    key: 'remark',
    width: 180,
    render: (row: IRoleList) =>
      row.remark
        ? h(
            NTooltip,
            {},
            {
              trigger: () =>
                h(
                  'div',
                  {},
                  h(
                    'n-ellipsis',
                    {
                      style: 'max-width: 160px',
                    },
                    { default: () => row.remark }
                  )
                ),
              default: () => row.remark,
            }
          )
        : '-',
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (row: IRoleList) => [
      h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          style: 'margin-right: 8px;',
          onClick: () => addOrEditEvent(true, row.id),
        },
        { default: () => '编辑' }
      ),
      h(
        NButton,
        {
          size: 'small',
          type: 'error',
          onClick: () => clickDeleteEvent(row.id),
        },
        { default: () => '删除' }
      ),
    ],
  },
]
</script>

<template>
  <CommonPage>
    <template #action>
      <div class="flex items-center gap-12">
        <n-button type="primary" @click="addOrEditEvent(false)">
          <i class="i-material-symbols:add mr-4 text-18" /> 新增角色
        </n-button>
        <n-button @click="clickBatchDeleteEvent">
          <i class="i-material-symbols:delete-outline mr-4 text-16" /> 批量删除
        </n-button>
      </div>
    </template>

    <MeCrud
      ref="crudRef"
      :columns="columns"
      row-key="id"
      :get-data="getData"
      v-model:query-items="searchParam"
      @onChecked="(keys) => (selectList = keys)"
    >
      <MeQueryItem label="角色名称" :label-width="70">
        <n-input v-model:value="searchParam.roleName" placeholder="请输入" clearable />
      </MeQueryItem>
      <MeQueryItem label="创建人" :label-width="70">
        <n-input v-model:value="searchParam.createByUsername" placeholder="请输入" clearable />
      </MeQueryItem>
      <MeQueryItem label="创建时间" :label-width="70">
        <n-date-picker
          v-model:value="searchParam.time"
          type="daterange"
          clearable
          :disable-date="(current: number) => current && current > dayjs().endOf('day').valueOf()"
          format="yyyy-MM-dd"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 100%"
        />
      </MeQueryItem>
      <MeQueryItem label="是否启用" :label-width="70">
        <n-select
          v-model:value="searchParam.status"
          placeholder="请选择"
          clearable
          :options="[
            { label: '是', value: 0 },
            { label: '否', value: 1 },
          ]"
        />
      </MeQueryItem>
      <template #buttons>
        <n-button @click="resetSearchParam">重置</n-button>
        <n-button type="primary" @click="() => crudRef.value?.handleSearch()">搜索</n-button>
      </template>
    </MeCrud>

    <AddOrEditModal ref="addModalRef" @add-refresh="() => crudRef.value?.handleSearch()" />
  </CommonPage>
</template>

<style lang="less" scoped>
.n-card {
  background-color: #fff;
}
</style>
