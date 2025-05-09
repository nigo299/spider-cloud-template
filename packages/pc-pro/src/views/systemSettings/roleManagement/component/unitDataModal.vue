<script setup lang="ts">
import { NotRevalidateOption, to } from '@/utils/to'
import { debounce } from 'lodash-es'
import useSWRV from 'swrv'
import { ref, watch, h } from 'vue'
import { CloseCircleOutline } from '@vicons/ionicons5'

import { getUnitList } from '@/api/system/roleManage'
import type { BasicDepartmentInfo, CheckUnit, UnitRecord } from '@/interface/system/roleManage'

const props = defineProps({
  unitList: {
    type: Array,
    default: () => [],
  },
  canbeEdit: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['handleSelect'])

const keyword = ref<string>('')
const listData = ref<CheckUnit[]>([])
const list = ref<BasicDepartmentInfo[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

watch(
  () => props.unitList,
  (val) => {
    list.value = val as BasicDepartmentInfo[]
    const idMap: CheckUnit[] = []
    list.value.forEach((item) => {
      idMap.push({
        label: item.orgTreeNamePathMapping,
        value: item.deptId,
        checked: true,
      })
    })
    listData.value = idMap
  },
  {
    immediate: true,
  }
)

async function getOrganizationTreeList() {
  const params = {
    orgLevelType: 1,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
  }
  const [data, err] = await to(getUnitList(params))

  if (!err) {
    data.list.forEach((item: UnitRecord) => {
      const idArray = list.value.map((item) => item.deptId)
      const exist = listData.value.some((jtem) => jtem.value === item.orgId)

      if (idArray.includes(item.orgId)) {
        item.checked = true

        if (!exist) {
          listData.value.push({
            label: item.orgTreeNamePathMapping,
            value: item.orgId,
            checked: true,
          })
        }
      } else {
        item.checked = false
      }
    })
    total.value = data.total
    return data.list
  } else {
    window.$message?.error(err.message)
  }
}
const { data: organizationData, mutate } = useSWRV(
  () => `[organizationTree]${pageNum.value}-${pageSize.value}`,
  () => getOrganizationTreeList(),
  NotRevalidateOption
)

function handleCheckChange(checked: boolean, value: string | number, name: string) {
  if (checked) {
    list.value.push({
      deptId: value as string,
      name: name,
      orgTreeNamePathMapping: name,
    })
    emits('handleSelect', list.value)
    listData.value.push({
      label: name,
      value: value as string,
      checked: checked,
    })
  } else {
    const index = list.value.findIndex((item) => item.deptId === value)
    list.value.splice(index, 1)
    emits('handleSelect', list.value)
    const dataIndex = listData.value.findIndex((item) => item.value === value)
    listData.value.splice(dataIndex, 1)
  }
}

function handleRemove(data: CheckUnit) {
  const index = list.value.findIndex((item) => item.deptId === data.value)
  list.value.splice(index, 1)
  emits('handleSelect', list.value)
  listData.value.splice(index, 1)
  const orgDataIndex = organizationData.value!.findIndex(
    (item: UnitRecord) => item.orgId === data.value
  )
  organizationData.value![orgDataIndex].checked = false
}

function handleRemoveAll() {
  list.value = []
  emits('handleSelect', list.value)
  listData.value = []
  organizationData.value!.forEach((item: UnitRecord) => (item.checked = false))
}

async function handleSearchClick() {
  pageNum.value = 1
  mutate()
}
const debounceHandleSearchClick = debounce(handleSearchClick, 500)
</script>

<template>
  <n-card :bordered="false" class="h-full overflow-y-auto">
    <div
      v-if="listData.length"
      class="w-auto min-h-[160px] border border-gray-500/20 pt-[10px] relative pb-[30px]"
    >
      <div class="flex flex-wrap">
        <div
          v-for="item in listData"
          :key="item.label"
          class="min-w-1/10 p-[5px] bg-gray-50 h-[30px] mx-[10px] flex items-center justify-between mb-[5px]"
        >
          <p class="mr-[5px] overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ item.label }}
          </p>
          <n-icon
            v-if="!props.canbeEdit"
            class="text-gray-300 ml-[5px] cursor-pointer"
            @click="handleRemove(item)"
          >
            <CloseCircleOutline />
          </n-icon>
        </div>
      </div>

      <div
        class="w-full h-[30px] flex items-center justify-end text-right absolute bottom-0 right-0"
      >
        <n-button v-if="!props.canbeEdit" size="small" type="error" text @click="handleRemoveAll">
          清空选择
        </n-button>
      </div>
    </div>
    <div
      v-else
      class="w-auto h-[160px] border border-gray-500/20 flex justify-start flex-wrap py-[10px]"
    >
      <n-empty class="w-full" description="暂无选择单位" />
    </div>
    <div v-if="!props.canbeEdit" class="w-auto mt-[10px]">
      <div class="my-3 search">
        <n-input
          v-model:value="keyword"
          placeholder="请输入关键字进行搜索"
          clearable
          @update:value="debounceHandleSearchClick"
        />
      </div>
      <h3 class="font-600 my-3">单位名称</h3>
      <div class="check-box pr-5">
        <template v-if="organizationData?.length">
          <n-checkbox
            v-for="item in organizationData"
            :key="item.orgId"
            :checked="item.checked"
            :value="item.orgId"
            class="mb-2 w-full justify-between"
            @update:checked="
              (checked) => handleCheckChange(checked, item.orgId, item.orgTreeNamePathMapping)
            "
          >
            {{ item.orgTreeNamePathMapping }}
          </n-checkbox>
          <n-pagination
            v-model:page="pageNum"
            v-model:page-size="pageSize"
            class="mt-2 flex justify-end"
            :item-count="total"
            :page-sizes="[10, 20, 30, 40]"
            show-size-picker
            :prefix="() => `共 ${total} 条`"
          />
        </template>
        <template v-else>
          <n-empty class="w-full" description="暂无相关单位" />
        </template>
      </div>
    </div>
  </n-card>
</template>

<style lang="less" scoped>
.check-box {
  :deep(.n-checkbox-wrapper) {
    width: 100%;
    margin-left: 0;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>
