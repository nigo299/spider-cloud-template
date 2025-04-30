<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 300,
  },
})

const ghostMessage = ref<HTMLDivElement>()
const toolTipVisible = ref(false)

onMounted(() => {
  isTooltip()
})

function isTooltip() {
  const nodeWidth = ghostMessage.value?.clientWidth
  if (nodeWidth && nodeWidth > props.width - 10) toolTipVisible.value = true
}
</script>

<template>
  <div v-if="!toolTipVisible" class="ellipsis-cell relative">
    {{ props.message }}
    <div ref="ghostMessage" class="absolute top-0 opacity-0 pointer-events-none">
      {{ props.message }}
    </div>
  </div>
  <n-tooltip v-else placement="top-start">
    <template #trigger>
      <div class="text">
        {{ props.message }}
      </div>
    </template>
    {{ props.message }}
  </n-tooltip>
</template>

<style>
.ellipsis-cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
