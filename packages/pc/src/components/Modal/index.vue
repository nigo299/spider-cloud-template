<script setup lang="ts">
import { Modal as AModal } from 'ant-design-vue'
import { computed, ref, watch } from 'vue'

interface Props {
  destroySelfOnClose?: boolean
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  destroySelfOnClose: false,
  visible: false,
})

// const emit = defineEmits(['update:visible', 'change'])

const render = ref(true)
let timer: NodeJS.Timeout | null = null

const modalProps = computed(() => ({
  cancelText: '取消',
  okText: '确定',
  maskClosable: false,
  ...props,
  // 在新版本中，visible 已被 open 替代，但为了保持向后兼容，这里保留 visible
  visible: props.visible,
}))

watch(
  () => props.visible,
  (newVal) => {
    if (!props.destroySelfOnClose) return

    if (newVal) {
      if (timer) clearTimeout(timer)
      render.value = newVal
    } else {
      timer = setTimeout(() => {
        render.value = newVal
      }, 1000)
    }
  }
)
</script>

<template>
  <AModal v-if="render" v-bind="modalProps" v-on="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </AModal>
</template>

<style lang="less" scoped>
.header-center {
  :deep(.ant-modal-header) {
    .ant-modal-title {
      text-align: center;
    }
  }
}

.footer-center {
  :deep(.ant-modal-footer) {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>
