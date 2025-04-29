# useECharts Hook 使用文档

`useECharts` 是一个 Vue 3 Hook，用于简化 ECharts 图表的初始化、更新和销毁等生命周期管理。它提供了图表实例的创建、配置更新、自适应调整等功能。

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { useECharts } from '@/hooks/useEcharts'

// 创建图表容器的引用
const chartRef = ref<HTMLElement | null>(null)

// 定义图表配置
const initOptions = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  }]
}

// 使用 useECharts hook
const { chartInstance, options, initChart, handleResize, disposeChart } = useECharts(
  chartRef,
  initOptions
)

// 可以通过 chartInstance 访问 ECharts 实例
// 可以通过修改 options 来更新图表
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px;" />
</template>
```

## API

### 参数

`useECharts` 接受以下参数：

- `chartRef: Ref<HTMLElement | null>` - 图表容器的 DOM 引用
- `initOptions: EChartsOption` - 图表的初始配置选项
- `theme?: string | object | null` - （可选）图表主题
- `opts?: EChartsInitOpts` - （可选）ECharts 初始化选项

### 返回值

返回一个对象，包含以下属性和方法：

- `chartInstance: ShallowRef<EChartsType | null>` - ECharts 实例的响应式引用
- `options: EChartsOption` - 图表配置选项的响应式对象
- `initChart: () => void` - 手动初始化图表的方法
- `handleResize: () => void` - 手动触发图表重绘的方法
- `disposeChart: () => void` - 手动销毁图表实例的方法

## 生命周期管理

Hook 会自动处理以下生命周期：

- **组件挂载时**：自动初始化图表并添加窗口 resize 监听
- **组件卸载时**：自动清理图表实例并移除事件监听
- **组件激活时**（keep-alive）：重新初始化图表并添加事件监听
- **组件停用时**（keep-alive）：清理图表实例并移除事件监听

## 响应式更新

图表配置（options）支持响应式更新：

```typescript
// 更新图表数据示例
options.series[0].data = [150, 230, 180, 90, 80, 120, 140]
```

## 注意事项

1. 确保图表容器元素具有明确的宽高，否则图表可能无法正确渲染
2. 在使用 keep-alive 组件时，Hook 会自动处理图表的重新初始化
3. 可以通过 `chartInstance` 直接访问 ECharts 实例，调用更多 ECharts 原生方法

## 完整示例

```vue
<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { ref } from 'vue'

import { useECharts } from '@/hooks/useEcharts'

const chartRef = ref<HTMLElement | null>(null)

const initOptions: EChartsOption = {
  title: {
    text: '示例图表'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
}

const { chartInstance, options } = useECharts(chartRef, initOptions)

// 更新数据的方法
const updateData = () => {
  options.series[0].data = [15, 25, 40, 12, 15, 25]
}
</script>

<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart" />
    <button @click="updateData">
      更新数据
    </button>
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
```
