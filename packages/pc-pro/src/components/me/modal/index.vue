<template>
  <n-modal
    v-model:show="show"
    class="modal-box"
    :style="{ width: modalOptions.width, ...modalOptions.modalStyle }"
    :preset="undefined"
    size="huge"
    :bordered="false"
    @after-leave="onAfterLeave"
  >
    <n-card :style="modalOptions.contentStyle" :closable="modalOptions.closable" @close="close()">
      <template #header>
        <header class="modal-header">
          {{ modalOptions.title }}
        </header>
      </template>
      <slot />

      <!-- 底部按钮 -->
      <template #footer>
        <slot name="footer">
          <footer v-if="modalOptions.showFooter" class="flex justify-end">
            <n-button v-if="modalOptions.showCancel" @click="handleCancel()">
              {{ modalOptions.cancelText }}
            </n-button>
            <n-button
              v-if="modalOptions.showOk"
              type="primary"
              :loading="modalOptions.okLoading"
              class="ml-20"
              @click="handleOk()"
            >
              {{ modalOptions.okText }}
            </n-button>
          </footer>
        </slot>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { initDrag } from './utils'

interface ModalOptions {
  width?: string
  title?: string
  closable?: boolean
  cancelText?: string
  okText?: string
  showFooter?: boolean
  showCancel?: boolean
  showOk?: boolean
  modalStyle?: Record<string, string>
  contentStyle?: Record<string, string>
  okLoading?: boolean
  onOk?: (data?: any) => Promise<any> | any
  onCancel?: (data?: any) => Promise<any> | any
  [key: string]: any
}

type ModalHandler = (data?: any) => Promise<any> | any

const props = defineProps({
  width: {
    type: String,
    default: '800px',
  },
  title: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  okText: {
    type: String,
    default: '确定',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  modalStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({}),
  },
  contentStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({}),
  },
  onOk: {
    type: Function as unknown as () => ModalHandler,
    default: () => ({}),
  },
  onCancel: {
    type: Function as unknown as () => ModalHandler,
    default: () => ({}),
  },
})

// 声明一个show变量，用于控制模态框的显示与隐藏
const show = ref<boolean>(false)
// 声明一个modalOptions变量，用于存储模态框的配置信息
const modalOptions = ref<ModalOptions>({})

const okLoading = computed({
  get() {
    return !!modalOptions.value?.okLoading
  },
  set(v: boolean) {
    if (modalOptions.value) {
      modalOptions.value.okLoading = v
    }
  },
})

// 打开模态框
async function open(options: Partial<ModalOptions> = {}): Promise<void> {
  // 将props和options合并赋值给modalOptions
  modalOptions.value = { ...props, ...options }

  // 将show的值设置为true
  show.value = true
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1) as HTMLElement,
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1) as HTMLElement,
  )
}

// 定义一个close函数，用于关闭模态框
function close(): void {
  show.value = false
}

// 定义一个handleOk函数，用于处理模态框确定操作
async function handleOk(data?: any): Promise<void> {
  // 如果modalOptions中没有onOk函数，则直接关闭模态框
  if (typeof modalOptions.value.onOk !== 'function') {
    return close()
  }
  try {
    // 调用onOk函数，传入data参数
    const res = await modalOptions.value.onOk(data)
    // 如果onOk函数的返回值不为false，则关闭模态框
    if (res !== false)
      close()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
  }
}

// 定义一个handleCancel函数，用于处理模态框取消操作
async function handleCancel(data?: any): Promise<void> {
  // 如果modalOptions中没有onCancel函数，则直接关闭模态框
  if (typeof modalOptions.value.onCancel !== 'function') {
    return close()
  }
  try {
    // 调用onCancel函数，传入data参数
    const res = await modalOptions.value.onCancel(data)

    // 如果onCancel函数的返回值不为false，则关闭模态框
    if (res !== false)
      close()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
  }
}

async function onAfterLeave(): Promise<void> {
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1) as HTMLElement,
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1) as HTMLElement,
  )
}

// 定义一个defineExpose函数，用于暴露open、close、handleOk、handleCancel函数
defineExpose({
  open,
  close,
  handleOk,
  handleCancel,
  okLoading,
  options: modalOptions,
})
</script>
