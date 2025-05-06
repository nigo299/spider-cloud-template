<script setup lang="ts">
import { useToggle } from '@vueuse/core'

import { to, NotRevalidateOption } from '@/utils/to'
import { debounce } from 'lodash-es'
import useSWRV from 'swrv'
import { ref, h, computed } from 'vue'
import { NIcon, NPopover, NRadioGroup, NRadio, NTooltip } from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import { EllipseOutline, BusOutline, SearchOutline } from '@vicons/ionicons5'

import {
  postOrganizationTreeListInDepartment,
  postSearchOrgTreeList,
  updateOrgType,
} from '@/api/system/organization'
import DeleteModal from './deleteModal.vue'
import { ORGANIZATION_LEVEL_TYPE } from '@/enums/index'
import type { IAsyncOrgData, ISearchDetail, ISearchList } from '@/interface/system/organization'
import { useOrgTableStore } from '@/store/modules/innerOrganization'
import type { OnLoad } from 'naive-ui/es/tree/src/interface'
import type { OnUpdateSelectedKeys } from 'naive-ui/es/tree/src/Tree'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['addOrganizationEmit', 'editOrganizationEmit', 'onSelectOrg'])
enum ORG_LEVEL_TYPE {
  公司,
  单位,
  部门,
}
// =======================    数据定义    =======================
const keyword = ref<string>('')
const selectedKeys = ref<string[]>()
const expandedKeys = ref<string[]>()
const [deleteVisible, toggle] = useToggle()
const customMessage = ref('您确定需要更改组织类型么？')
const customHint = ref('更改后单位和部门关联的角色数据和业务数据可能会存在偏差或调整，请谨慎操作')
const deleteLoading = ref(false)

const fieldNames = {
  children: 'children',
  label: 'name',
  key: 'id',
}
// =======================    请求   =======================
const orgId = ref<number | null>() // 组织查询接口需要的orgId

// 将API返回的数据转换为符合TreeOption格式的数据
function transformToTreeOption(data: IAsyncOrgData[] | undefined): TreeOption[] {
  if (!data) return []

  return data.map((item): TreeOption => {
    // 将children为null的转为undefined，符合TreeOption类型
    const children = item.children ? transformToTreeOption(item.children) : undefined

    return {
      key: item.id,
      label: item.name,
      // 保存原始属性用于渲染和处理
      orgLevelType: item.orgLevelType,
      id: item.id,
      isManaged: item.isManaged,
      canChangeLevelType: item.canChangeLevelType,
      // 如果没有children且非叶子节点，设置为懒加载
      isLeaf: item.isLeaf,
      children,
    }
  })
}

// 存储原始树数据的响应式引用
const treeDataRef = ref<IAsyncOrgData[]>([])

// 计算处理后的树选项
const treeOptions = computed<TreeOption[]>(() => {
  return transformToTreeOption(treeDataRef.value)
})

// 异步获取子级组织
async function getSonOrgList(nodeId: string | number) {
  // 确保以字符串形式传递ID
  const nodeIdStr = String(nodeId)

  const params = {
    orgType: 0,
    orgId: nodeIdStr,
  }
  console.log('查询子节点参数:', params)

  const [data, err] = await to(postOrganizationTreeListInDepartment(params))
  if (!err) {
    console.log('子节点数据:', data)
    return data
  } else {
    window.$message.error(err.message)
    return []
  }
}

// 异步加载节点
const handleLoad: OnLoad = (node: TreeOption) => {
  // 记录当前节点ID，使用当前节点的key(id)查询子节点
  const currentNodeId = node.key as string | number
  if (!currentNodeId) {
    console.error('节点ID为空:', node)
    window.$message.error('节点ID为空，无法加载子节点')
    return Promise.resolve()
  }

  console.log('展开节点:', node)

  return new Promise<void>((resolve) => {
    // 使用当前节点id查询子节点
    getSonOrgList(currentNodeId)
      .then((data) => {
        // 将API返回的数据转换为TreeOption格式
        const children = transformToTreeOption(data as IAsyncOrgData[])
        console.log('转换后的子节点:', children)

        // 如果存在原始数据，更新它
        if (treeDataRef.value) {
          // 递归查找并更新子节点
          const updateNodeChildren = (nodes: IAsyncOrgData[]) => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === String(currentNodeId)) {
                // 找到当前节点，更新其children
                const childrenData = data as IAsyncOrgData[] | null
                // 使用类型断言确保childrenArray是IAsyncOrgData[]类型
                const childrenArray = childrenData ? [...childrenData] : ([] as IAsyncOrgData[])
                nodes[i].children = childrenArray
                break
              }
              // 如果children存在且为数组，递归处理
              if (nodes[i].children && Array.isArray(nodes[i].children)) {
                updateNodeChildren(nodes[i].children as IAsyncOrgData[])
              }
            }
          }

          // 更新原始数据源
          updateNodeChildren(treeDataRef.value)
        }

        // 直接设置当前节点的children
        node.children = children

        resolve()
      })
      .catch((err) => {
        // 异步加载失败处理
        console.error('加载子组织失败', err)
        window.$message.error('加载子组织失败')
        resolve()
      })
  })
}

// 初始化树数据
async function getOrganizationTreeList() {
  const params = {
    orgType: 0,
    orgId: orgId.value ?? null,
  }
  const [data, err] = await to(postOrganizationTreeListInDepartment(params))
  if (!err) {
    // 保存到响应式引用
    treeDataRef.value = data as IAsyncOrgData[]
    return data
  } else window.$message.error(err.message)
}

// 使用SWRV获取数据
const { data: treeData, isValidating: loading } = useSWRV(
  '[innerOrganizationTree]',
  getOrganizationTreeList,
  NotRevalidateOption
)

const orgTableStore = useOrgTableStore()

const handleSelectKeys = (keys: string[], options: Array<TreeOption | null>) => {
  if (keys.length > 0) {
    const nodeKey = keys[0]
    const params = {
      orgId: nodeKey, // 列表接口需要的orgId
    }
    selectedKeys.value = [nodeKey]
    orgTableStore.setOrgIdAction(nodeKey)
    emits('onSelectOrg', params)
  }
}

// 搜索展示详情
async function handleSearchMemberDetail(detail: ISearchDetail) {
  selectedKeys.value = [detail.orgId]
  const params = {
    orgId: detail.orgId,
    pageNum: 1,
    pageSize: 10,
  }
  emits('onSelectOrg', { ...params, memberName: detail.memberName })
  expandedKeys.value = detail.orgTreePathMappingList
}

const searchList = ref<ISearchList[]>([])

async function handleSearchClick() {
  if (!keyword.value) {
    searchList.value = []
    return
  }
  const params = {
    keyword: keyword.value,
    pageNum: 1,
    pageSize: 999,
  }
  const [data, err] = await to(postSearchOrgTreeList(params))
  if (!err) searchList.value = data.list
  else window.$message.error(err.message)
}
const debounceHandleSearchClick = debounce(handleSearchClick, 1000)

const updateOrgId = ref('')
const updateOrgLevel = ref(0)

async function changeDepartType(value: number, id: string) {
  updateOrgId.value = id
  updateOrgLevel.value = value
  toggle()
}

function updateType(arr: IAsyncOrgData[] | undefined, id: string, type: number) {
  if (!arr) return
  const dataIndex = arr.findIndex((item) => item.id === id)

  if (dataIndex === -1) {
    arr.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        updateType(item.children as IAsyncOrgData[], id, type)
      }
    })
  } else {
    arr[dataIndex].orgLevelType = type
  }
}

async function confirmInDelModal() {
  deleteLoading.value = true
  const params = {
    orgId: updateOrgId.value,
    orgLevelType: updateOrgLevel.value,
  }
  const [, err] = await to(updateOrgType(params))

  if (!err) {
    try {
      updateType(treeDataRef.value, updateOrgId.value, updateOrgLevel.value)
      window.$message.success('修改成功')
      cancelInDelModal()
    } catch {
      window.$message.error('修改失败，请重试')
      deleteLoading.value = false
    }
  } else {
    deleteLoading.value = false
    window.$message.error(err.message)
  }
}

function cancelInDelModal() {
  toggle()
  updateOrgId.value = ''
  updateOrgLevel.value = 0
  deleteLoading.value = false
}

function renderTreeNodeLabel(info: { option: TreeOption }) {
  const option = info.option as TreeOption & {
    orgLevelType: number
    id: string
    isManaged: boolean
    canChangeLevelType: boolean
  }

  // 使用option.label替代name，避免undefined
  const name = option.label || ''
  const { orgLevelType, id, isManaged, canChangeLevelType } = option

  function renderNodeContent() {
    const showTypeChanger =
      orgLevelType !== ORGANIZATION_LEVEL_TYPE.company && isManaged && canChangeLevelType

    // 组织类型更改按钮
    const typeChangeEl = showTypeChanger
      ? h(
          NPopover,
          { trigger: 'hover' },
          {
            trigger: () =>
              h(
                NIcon,
                {
                  'v-permission': ['button_contact_department_change_level_type'],
                },
                { default: () => h(EllipseOutline) }
              ),
            default: () =>
              h(
                NRadioGroup,
                {
                  value: orgLevelType,
                  onUpdateValue: (value: number) => changeDepartType(value, id),
                },
                {
                  default: () => [
                    h(NRadio, { value: 1, class: 'flex' }, { default: () => '单位' }),
                    h(NRadio, { value: 2, class: 'flex' }, { default: () => '部门' }),
                  ],
                }
              ),
          }
        )
      : null

    // 组织名称元素
    const nameEl =
      typeof name === 'string' && name.length < 15
        ? h('div', { class: 'w-1/2 truncate' }, h('span', {}, name))
        : h(
            NTooltip,
            { placement: 'top' },
            {
              trigger: () => h('div', { class: 'w-1/2 truncate' }, h('span', {}, name)),
              default: () => h('span', {}, name),
            }
          )

    // 组织类型名称
    const typeEl = h('div', { class: 'mr-4' }, ORG_LEVEL_TYPE[orgLevelType])

    // 类型更改按钮容器
    const actionEl = h('div', { class: 'flex mr-4 w-6 items-center' }, BusOutline)

    return h('div', { class: 'flex w-full truncate justify-between' }, [nameEl, typeEl, actionEl])
  }

  return renderNodeContent()
}

// 添加node-props函数来设置节点样式
function nodeProps({ option }: { option: TreeOption }) {
  return {
    class: 'w-full custom-tree-node',
    style: selectedKeys.value?.includes(option.key as string)
      ? 'background-color: rgba(0, 112, 107, 0.1); color: #00706b;'
      : '',
  }
}
</script>

<template>
  <div class="h-full w-full tree">
    <!-- 标题 -->
    <div class="mb-6 title">
      <h3 class="text-18 font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <div class="bg-[#00706b] h-20px w-4px rounded-sm mr-10"></div>
        <span>组织机构</span>
      </h3>
    </div>
    <div v-if="props.showSearch" class="mb-4">
      <n-input
        v-model:value="keyword"
        placeholder="请输入组织/姓名关键词"
        clearable
        class="search-input"
        @update:value="debounceHandleSearchClick"
      >
        <template #suffix>
          <n-icon
            class="flex items-center justify-center cursor-pointer text-[#00706b]"
            @click="debounceHandleSearchClick"
          >
            <SearchOutline />
          </n-icon>
        </template>
      </n-input>
    </div>
    <!-- 搜索树形  -->
    <div v-if="!keyword" class="flex mt-4 mb-3 px-2 justify-between text-gray-500 font-medium">
      <div>组织名称</div>
      <div class="mr-8">组织类型</div>
    </div>
    <div
      v-if="!keyword"
      class="w-full max-h-[calc(90vh-160px)] overflow-hidden overflow-y-auto custom-scrollbar"
    >
      <n-tree
        v-model:selected-keys="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        :data="treeOptions"
        :on-load="handleLoad"
        show-irrelevant-nodes
        selectable
        :keyboard="false"
        :node-props="nodeProps"
        :expand-on-click="false"
        :virtual-scroll="false"
        :pattern="keyword"
        remote
        :render-label="renderTreeNodeLabel"
        @update:selected-keys="handleSelectKeys"
      />
    </div>
    <div v-else class="w-full max-h-[calc(100%)] overflow-hidden overflow-y-auto custom-scrollbar">
      <template v-for="(item, index) in searchList" :key="index">
        <div
          class="search-item cursor-pointer flex w-full items-center p-3 rounded-md mb-1 hover:(bg-[rgba(0,112,107,0.08)])"
          @click="handleSearchMemberDetail(item)"
        >
          <div class="mr-3 text-xl text-[#00706b]">
            <n-icon>
              <i class="i-fe:user" />
            </n-icon>
          </div>
          <div class="w-9/10 truncate">
            <div v-if="item.memberName" class="text-gray-800 dark:text-gray-200 font-medium">
              {{ item.memberName }}
            </div>
            <n-tooltip placement="top">
              <template #trigger>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.orgTreeNamePathMapping }}
                </span>
              </template>
              {{ item.orgTreeNamePathMapping }}
            </n-tooltip>
          </div>
        </div>
      </template>
    </div>
  </div>
  <DeleteModal
    :visible="deleteVisible"
    title="更改组织"
    :message="customMessage"
    :hint="customHint"
    :loading="deleteLoading"
    @confirm="confirmInDelModal"
    @cancel="cancelInDelModal"
  />
</template>

<style lang="less" scoped>
.tree {
  :deep(.n-tree .n-tree-node-wrapper) {
    width: 100%;
    margin-bottom: 2px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 4px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  :deep(.n-tree .n-tree-node-wrapper:hover) {
    background-color: rgba(0, 112, 107, 0.05);
  }

  :deep(.n-tree-node-content) {
    flex: 1;
    overflow: auto;
  }

  :deep(.n-tree .n-tree-node-content .n-tree-node-content__prefix) {
    color: #00706b;
  }

  :deep(.n-tree .n-tree-node--selected > .n-tree-node-wrapper) {
    background-color: rgba(0, 112, 107, 0.1);
    color: #00706b;
  }
}

.search-input {
  :deep(.n-input__border),
  :deep(.n-input__state-border) {
    border-color: #e5e7eb;
  }

  :deep(.n-input:hover .n-input__border) {
    border-color: #00706b;
  }

  :deep(.n-input--focus .n-input__state-border) {
    box-shadow: 0 0 0 2px rgba(0, 112, 107, 0.2);
    border-color: #00706b;
  }
}

.search-item {
  transition: background-color 0.2s;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 112, 107, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 112, 107, 0.3);
    border-radius: 6px;
  }
}
</style>
