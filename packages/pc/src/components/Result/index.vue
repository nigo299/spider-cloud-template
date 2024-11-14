<script setup>
import {
  CheckCircleFilled,
  RightOutlined,
} from '@ant-design/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'check-circle',
  },
  title: {
    type: String,
    default: '提交成功！',
  },
  content: {
    type: String,
    default: '下一步',
  },
})

const emit = defineEmits(['nextHandler'])

// 计算自定义图标组件
const customIcon = computed(() => {
  if (props.icon === 'check-circle')
    return null
  // 如果需要支持其他内置图标，可以在这里添加导入和判断逻辑
  return null
})

const nextHandler = () => {
  emit('nextHandler')
}
</script>

<template>
  <div class="t_antd_result">
    <CheckCircleFilled v-if="icon === 'check-circle'" class="success-icon" />
    <component
      :is="customIcon"
      v-else-if="customIcon"
      class="custom-icon"
    />
    <p class="content">
      {{ title }}
    </p>
    <p class="next" @click="nextHandler">
      {{ content }}
      <RightOutlined />
    </p>
  </div>
</template>

<style lang="less" scoped>
.t_antd_result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .success-icon {
    margin-top: 28px;
    font-size: 48px;
    color: #51c31b;
  }

  .custom-icon {
    margin-top: 28px;
    font-size: 48px;
  }

  .content {
    margin: 16px 0 13px 12px;
    font-size: 18px;
    color: #000;
  }

  .next {
    margin-bottom: 18px;
    font-size: 14px;
    color: #355db4;
    cursor: pointer;

    .anticon {
      margin-left: 8px;
      color: #868487;
    }
  }
}
</style>
