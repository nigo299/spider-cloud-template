<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { listenDomChange } from '@/utils'
// 使用 props 的默认值
const props = withDefaults(defineProps<IChartProps>(), {
  option: () => ({}),
  loading: false,
  noData: false,
})

export interface IChartProps {
  option?: any
  loading?: boolean
  noData?: boolean
}

export interface IChartExpose {
  chartsInstance: any
}

const chartsRef = ref<HTMLDivElement | null>(null)
const chartsInstance = shallowRef<echarts.ECharts | null>(null)

/**
 *  监听父容器大小变化，调整图表大小
 */
const listenMapChange = function () {
  const targetNode = chartsRef.value
  // 观察器的配置
  listenDomChange(targetNode!, () => {
    resizeChart()
  })
}

// 监控 option 变化，更新图表
watch(
  () => props.option,
  (newOption) => {
    if (newOption && chartsInstance.value) {
      chartsInstance.value.clear()
      chartsInstance.value.setOption(newOption, true, true)
    }
  },
  { deep: true },
)

onMounted(() => {
  nextTick(() => {
    if (!chartsRef.value)
      return

    chartsInstance.value = echarts.init(chartsRef.value!)

    if (props.option) {
      chartsInstance.value.setOption(props.option)
    }

    // 初始化时设置图表大小
    resizeChart()
    listenMapChange()
  })
})

// 自定义函数来调整图表大小
function resizeChart() {
  if (chartsInstance.value && chartsRef.value) {
    const width = chartsRef.value.clientWidth
    const height = chartsRef.value.clientHeight
    chartsInstance.value.resize({
      width,
      height,
    })
  }
}

defineExpose({ chartsInstance })
</script>

<template>
  <div class="flex-1 h-full relative">
    <div
      v-if="props.loading"
      class="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center text-14px bg-[#ffffff] space-y-16px z-1"
    >
      <div class="text-[#00706B]">
        加载中～
      </div>
    </div>

    <div
      v-if="!props.loading && props.noData"
      class="w-full h-full absolute top-0 left-0 flex items-center justify-center text-14px bg-[#ffffff] text-[#00706B] z-1"
    >
      --- 暂无数据 ---
    </div>
    <div ref="chartsRef" class="h-full container" />
  </div>
</template>

<style scoped lang="less"></style>
