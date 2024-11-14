# SSelect 选择器组件

基于 ant-design-vue 的 Select 组件封装,支持单选、多选、全选、分页等功能。

## 基本用法

```vue
<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { key: '1', label: '选项1' },
  { key: '2', label: '选项2' },
  { key: '3', label: '选项3' }
]
</script>

<template>
  <SSelect
    v-model="value"
    :option-source="options"
    placeholder="请选择"
  />
</template>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
modelValue | 选中的值 | `string \| number \| array \| boolean \| object` | -
mode | 设置选择模式 | `'multiple'` | -
placeholder | 选择框默认文字 | `string` | `'请选择'`
width | 选择框宽度 | `string` | `'100%'`
customLabel | 自定义设置下拉label | `string` | -
valueKey | 选项的值字段名 | `string` | `'key'`
labelKey | 选项的标签字段名 | `string` | `'label'`
optionSource | 下拉框数据源 | `array` | -
isShowPagination | 是否显示分页 | `boolean` | `false`
paginationOption | 分页配置项 | `object` | `{ pageSize: 6, current: 1, total: 0 }`

### Events

事件名称 | 说明 | 回调参数
--- | --- | ---
update:modelValue | 选中值变化时触发 | 选中的值
select | 被选中时调用 | `value, option`
change | 选中值变化时触发 | 选中的值
current-change | 分页切换时触发 | 当前页码

### Slots

插槽名 | 说明
--- | ---
默认插槽 | 自定义选项内容
```
