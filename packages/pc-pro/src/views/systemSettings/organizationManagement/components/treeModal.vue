<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, SelectOption } from 'naive-ui'

import type { ITreeAdd, ITreeEdit, ITreeModalFormState } from '@/interface/system/organization'

// 备注any： 此版本无此功能，此界面暂时未对接接口，暂用any
const addParams = ref<any>()
const formRef = ref<FormInst>()

const visible = ref<boolean>(false)

const formState = ref<ITreeModalFormState>({
  title: '',
  organization: '',
})

// 组织选项
const organizationOptions: SelectOption[] = [
  { label: 'Zone one', value: 'shanghai' },
  { label: 'Zone two', value: 'beijing' },
]

// 表单验证
function onFinish() {
  visible.value = false
}

// 表单重置
function resetForm() {
  formRef.value?.restoreValidation()
  visible.value = false
}

function showModal(params: ITreeAdd | ITreeEdit) {
  if (params.isEdit) {
    // 编辑
    formState.value = params
  } else {
    // 新增
  }
  addParams.value = params
  visible.value = true
}

defineExpose({
  showModal,
})
</script>

<template>
  <div class="organization">
    <n-modal
      v-model:show="visible"
      :title="addParams?.isEdit ? '编辑组织' : '新增组织'"
      :mask-closable="false"
      style="width: 30%"
      @close="resetForm"
      @positive-click="onFinish"
    >
      <template #action>
        <n-space>
          <n-button @click="resetForm">取消</n-button>
          <n-button type="primary" @click="onFinish">确定</n-button>
        </n-space>
      </template>
      <n-form
        ref="formRef"
        class="form"
        :model="formState"
        label-placement="left"
        :label-width="80"
      >
        <n-form-item v-if="!addParams.isTop" label="父级组织" path="organization">
          <n-select v-model:value="formState.organization" :options="organizationOptions" />
        </n-form-item>

        <n-form-item
          label="组织名称"
          path="title"
          :rule="[
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { min: 1, max: 20, message: '组织名称长度为1~20位', trigger: 'blur' },
          ]"
        >
          <n-input v-model:value="formState.title" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<style lang="less" scoped>
.organization {
  :deep(.n-modal-header) {
    text-align: center;
  }
}
</style>
