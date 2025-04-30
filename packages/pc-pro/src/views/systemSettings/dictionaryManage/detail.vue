<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'
import { NotRevalidateOption, to } from '@/utils/to'

import { type DataTableColumns, type PaginationProps, type SelectOption } from 'naive-ui'
import useSWRV from 'swrv'
import { ref, watch, h } from 'vue'

import { deleteDictionaryDetail, getDictionaryDetailList } from '@/api/system/dictionary'
import type { CommonListType } from '@/interface'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'

import AddOrEditModal from './addOrEditModal.vue'
import { headerColumns, headerConfig } from './config/detailFormConfig'
import { tableColumns, tableConfig } from './config/detailTableConfig'

const formState = ref<Record<string, any>>({})
const params: Record<string, string | null> = useUrlSearchParams('hash')
const dictId = params.id as string
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  dictId,
})
const selectList = ref<string[]>([])
const modalRef = ref<InstanceType<typeof AddOrEditModal>>()

const {
  data: dataSource,
  isValidating: loading,
  mutate: getList,
} = useSWRV(
  () => `[dictionary-detail-list]${JSON.stringify(queryParams.value)}`,
  () => getDictionaryDetailList(queryParams.value),
  NotRevalidateOption
)

// 改造列配置为NaiveUI数据表格格式
const naiveColumns: DataTableColumns<any> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
    width: 70,
    render: (_row: any, index: number) => index + 1,
  },
  {
    title: '字典标签',
    key: 'dictLabel',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
  },
  {
    title: '字典键值',
    key: 'dictValue',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    width: 100,
    render(row: any) {
      return h(
        'n-tag',
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
    align: 'center',
    width: 160,
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    width: 160,
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 150,
    render(row: any) {
      return [
        h(
          'n-button',
          {
            text: true,
            type: 'primary',
            style: 'margin-right: 10px',
            onClick: () => toEdit(row),
          },
          { default: () => '编辑' }
        ),
        h(
          'n-button',
          {
            text: true,
            type: 'error',
            onClick: () => deleteInList(row.id),
          },
          { default: () => '删除' }
        ),
      ]
    },
  },
]

// 分页配置
const pagination: PaginationProps = {
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0,
  onUpdatePage: (page: number) => {
    pagination.page = page
    queryParams.value.pageNum = page
    getList()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    queryParams.value.pageSize = pageSize
    queryParams.value.pageNum = 1
    getList()
  },
  prefix: ({ itemCount }) => `共 ${itemCount} 条`,
}

watch(
  () => dataSource.value,
  () => {
    if (dataSource.value) {
      pagination.itemCount = dataSource.value.total as number
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

const toEdit = (row: IDictionaryAddOrEditParams) => {
  const updatedRow = { ...row, dictId }
  modalRef.value?.showModal(true, true, updatedRow)
}

const toAdd = () => {
  modalRef.value?.showModal(false, true, { dictId })
}

const deleteInList = async (id: string) => {
  const [, err] = await to(deleteDictionaryDetail(id))

  if (!err) {
    window.$message.success('删除成功！')
    if (queryParams.value.pageNum > 1 && dataSource.value!.list.length === 1) {
      queryParams.value.pageNum--
      pagination.page = queryParams.value.pageNum
    }
    getList()
  } else {
    window.$message.error(err.message)
  }
}

const tapSearchRole = () => {
  queryParams.value.pageNum = 1
  pagination.page = 1
  Object.assign(queryParams.value, formState.value)
  getList()
}

const resetForm = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    dictId,
  }
  formState.value = {}
  pagination.page = queryParams.value.pageNum
  pagination.pageSize = queryParams.value.pageSize
  getList()
}

// 转换options格式
function convertSelectOptions(options?: CommonListType[]): SelectOption[] {
  if (!options) return []
  return options.map((item) => ({
    label: item.label || '',
    value: item.value,
    disabled: item.disabled,
  }))
}
</script>

<template>
  <n-layout>
    <n-space vertical :size="12" class="h-full">
      <n-space align="center" :size="8">
        <n-button @click="$router.back()">
          <template #icon>
            <n-icon><i class="i-carbon-arrow-left" /></n-icon>
          </template>
          返回
        </n-button>
      </n-space>

      <n-card class="mb-10px">
        <n-space vertical :size="16">
          <n-form ref="formRef" :model="formState" inline label-placement="left" label-width="auto">
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="6" v-for="item in headerColumns" :key="item.field">
                <n-form-item :label="item.label">
                  <template v-if="item.type === 'input'">
                    <n-input
                      v-model:value="formState[item.field]"
                      :placeholder="
                        typeof item.placeholder === 'string' ? item.placeholder : '请输入'
                      "
                      clearable
                    />
                  </template>
                  <template v-else-if="item.type === 'select'">
                    <n-select
                      v-model:value="formState[item.field]"
                      :options="convertSelectOptions(item.options)"
                      :placeholder="
                        typeof item.placeholder === 'string' ? item.placeholder : '请选择'
                      "
                      clearable
                    />
                  </template>
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-space justify="end" class="mt-4">
              <n-button @click="resetForm">重置</n-button>
              <n-button type="primary" @click="tapSearchRole">搜索</n-button>
            </n-space>
          </n-form>
        </n-space>
      </n-card>

      <n-card>
        <n-space vertical :size="12">
          <n-space>
            <n-button type="primary" @click="toAdd">新增</n-button>
          </n-space>

          <n-data-table
            :columns="naiveColumns"
            :data="dataSource ? dataSource.list : []"
            :loading="loading"
            :pagination="pagination"
            :bordered="false"
          />
        </n-space>
      </n-card>
    </n-space>

    <AddOrEditModal ref="modalRef" @refresh="getList" />
  </n-layout>
</template>
