# DateRangePicker 日期范围选择器

基于 ant-design-vue 的 DatePicker 封装，支持日期范围选择、月份选择、范围限制等功能。

## 基本用法

基础的日期范围选择功能。

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const dateRange = ref<[Dayjs | null, Dayjs | null]>([null, null])
const monthRange = ref<[Dayjs | null, Dayjs | null]>([null, null])
const limitedRange = ref<[Dayjs | null, Dayjs | null]>([null, null])
const minDate = dayjs().subtract(1, 'month')
const maxDate = dayjs().add(1, 'month')
</script>

<template>
  <ASpace :size="15" direction="vertical">
    <!-- 基础日期范围选择 -->
    <DateRangePicker v-model="dateRange" />

    <!-- 月份范围选择 -->
    <DateRangePicker
      v-model="monthRange"
      type="month"
      format="YYYY-MM"
    />

    <!-- 限制可选范围 -->
    <DateRangePicker
      v-model="limitedRange"
      :langest="30"
      :disabled-range="[minDate, maxDate]"
    />
  </ASpace>
</template>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
modelValue | 日期范围值 | `[Dayjs \| null, Dayjs \| null]` | `[null, null]`
format | 日期格式化 | `string` | `'YYYY-MM-DD HH:mm:ss'`
showTime | 是否显示时间选择 | `boolean \| object` | `false`
allowClear | 是否允许清除 | `boolean` | `false`
type | 选择器类型 | `'day' \| 'month' \| 'quarter' \| 'year'` | `'day'`
langest | 最大可选范围（数字表示天数） | `boolean \| number` | `false`
disabledRange | 禁用的日期范围 | `[Dayjs \| false, Dayjs \| false]` | `[false, false]`
inputReadOnly | 输入框是否只读 | `boolean` | `false`
placeholder | 占位符 | `[string, string]` | `['开始时间', '结束时间']`
getCalendarContainer | 浮层渲染父节点 | `() => HTMLElement` | `() => document.body`

### Events

事件名 | 说明 | 回调参数
--- | --- | ---
update:modelValue | 日期范围变化时触发 | `(dates: [Dayjs \| null, Dayjs \| null]) => void`
openChange | 面板打开/关闭时触发 | `() => void`

### 示例

#### 带时间选择的日期范围

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const dateTimeRange = ref<[Dayjs | null, Dayjs | null]>([null, null])
</script>

<template>
  <DateRangePicker
    v-model="dateTimeRange"
    :show-time="true"
    format="YYYY-MM-DD HH:mm:ss"
  />
</template>
```

#### 自定义日期范围限制

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const customRange = ref<[Dayjs | null, Dayjs | null]>([null, null])
const minDate = dayjs().subtract(1, 'month')
const maxDate = dayjs().add(1, 'month')
</script>

<template>
  <DateRangePicker
    v-model="customRange"
    :langest="7"
    :disabled-range="[minDate, maxDate]"
    format="YYYY-MM-DD"
  />
</template>
```
