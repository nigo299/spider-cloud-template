<template>
  <div>
    <n-space vertical :size="12">
      <h3>菜单</h3>
      <div class="flex">
        <n-input v-model:value="pattern" placeholder="搜索" clearable />
        <NButton class="ml-12" type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-14" />
          新增
        </NButton>
      </div>

      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        :data="treeData as TreeOption[]"
        :selected-keys="[currentMenu?.code]"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        :on-update:selected-keys="onSelect as any"
        key-field="code"
        label-field="name"

        block-line default-expand-all
      />
    </n-space>

    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="(data: any) => emit('refresh', data)" />
  </div>
</template>

<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import { withModifiers } from 'vue'
import api from '../api'
import ResAddOrEdit from './ResAddOrEdit.vue'

defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  currentMenu: {
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(['refresh', 'update:currentMenu'])

const pattern = ref('')

const modalRef = ref<InstanceType<typeof ResAddOrEdit> | null>(null)
async function handleAdd(data = {}) {
  modalRef.value?.handleOpen({
    action: 'add',
    title: '新增菜单',
    row: { type: 'MENU', ...data },
    okText: '保存',
  })
}

function onSelect(keys: string[], option: TreeOption, { action, node }: { action: string, node: TreeOption }) {
  emit('update:currentMenu', action === 'select' ? node : null)
}

function renderPrefix({ option }: { option: TreeOption }) {
  return h('i', { class: `${option.icon}?mask text-16` })
}

function renderSuffix({ option }: { option: TreeOption }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: '新增下级菜单',
        size: 'tiny',
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
      },
      { default: () => '新增' },
    ),

    h(
      NButton,
      {
        text: true,
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 12px;',
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => '删除' },
    ),
  ]
}

function handleDelete(item: TreeOption) {
  window.$dialog.confirm({
    content: `确认删除【${item.name}】？`,
    async confirm() {
      try {
        window.$message.loading('正在删除', { key: 'deleteMenu' })
        await api.deletePermission(item.id as string)
        window.$message.success('删除成功', { key: 'deleteMenu' })
        emit('refresh')
        emit('update:currentMenu', null)
      }
      catch (error) {
        console.error(error)
        window.$message.destroy('deleteMenu')
      }
    },
  })
}
</script>
