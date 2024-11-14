# Result 结果展示组件

基于 Ant Design Vue 的结果展示组件,用于反馈操作结果。

## 基本用法

```vue
<script setup>
const handleNext = () => {
  console.log('点击下一步')
}
</script>

<template>
  <Result
    title="提交成功！"
    content="下一步"
    @nextHandler="handleNext"
  />
</template>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
icon | 图标类型 | `string` | `'check-circle'`
title | 标题文本 | `string` | `'提交成功！'`
content | 下一步按钮文本 | `string` | `'下一步'`

### Events

事件名称 | 说明 | 回调参数
--- | --- | ---
nextHandler | 点击下一步时的回调函数 | -

### 内置图标类型

目前支持的图标类型:
- check-circle: 成功图标(默认)
