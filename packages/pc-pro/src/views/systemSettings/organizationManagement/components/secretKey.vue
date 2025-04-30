<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import { to } from '@/utils/to'
import { ref, watch } from 'vue'

import { decrypt, keyPassword } from '@/api/user/index'
import { useSecretKeyStore } from '@/store/modules/secretKey'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '查看',
  },
  secretKeyType: {
    type: String,
    default: '',
  },
  secretKeyPhone: {
    type: String,
    default: '',
  },
  secretKeyIdCard: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['cancel', 'confirm'])

const { SecretKey, changeSecretKeyStore } = useSecretKeyStore()
const [submitLoading, submitLoadingToggle] = useToggle()
const [visible, visibleToggle] = useToggle()
const keyword = ref('')

watch(
  () => props.visible,
  (visible) => {
    if (props.secretKeyPhone || props.secretKeyIdCard) {
      visibleToggle(visible)
      return
    }

    if (visible && SecretKey[props.secretKeyType]) {
      changeSecretKeyStore(props.secretKeyType, false)
      handleCancel()
    } else {
      visibleToggle(visible)
    }
  }
)

function handleCancel() {
  keyword.value = ''
  submitLoadingToggle(false)
  emits('cancel')
}

async function handleConfirm() {
  if (!keyword.value) {
    window.$message.warning('请输入密钥')
    return
  }
  submitLoadingToggle(true)

  if (props.secretKeyIdCard) {
    const params = {
      infoMap: {
        phone: '',
        idCard: props.secretKeyIdCard,
      },
      secondPassword: keyword.value,
    }
    const [data, err] = await to(decrypt(params))

    if (!err) {
      emits('confirm', data)
      handleCancel()
    } else {
      window.$message.error(err.message ?? '验证失败，请重试')
    }
  } else {
    const [, err] = await to(keyPassword(keyword.value))

    if (!err) {
      changeSecretKeyStore(props.secretKeyType, true)
      handleCancel()
    } else {
      window.$message.error(err.message ?? '验证失败，请重试')
    }
  }
  submitLoadingToggle(false)
}

defineExpose({
  visibleToggle,
})
</script>

<template>
  <div>
    <n-modal
      :z-index="1001"
      :show="visible"
      :title="title"
      :mask-closable="false"
      style="width: 30%"
      @close="handleCancel"
    >
      <n-form>
        <n-form-item label="密钥">
          <n-input v-model:value="keyword" placeholder="请输入" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <n-button @click="handleCancel">取消</n-button>
          <n-button
            type="primary"
            ghost
            :disabled="!keyword"
            :loading="submitLoading"
            @click="handleConfirm"
          >
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
