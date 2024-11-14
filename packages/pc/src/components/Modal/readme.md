# Modal 对话框组件

基于 ant-design-vue 的 Modal 组件封装,支持自动销毁和插槽透传等功能。

## 基本用法

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <Modal v-model:visible="visible" title="标题">
    <p>对话框内容</p>
  </Modal>
</template>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
visible | 对话框是否可见 | `boolean` | `false`
destroySelfOnClose | 关闭时是否销毁组件 | `boolean` | `false`

### 样式类名

类名 | 说明
--- | ---
header-center | 标题居中显示
footer-center | 底部按钮居中显示

### 插槽

组件支持透传 ant-design-vue Modal 的所有插槽。

常用插槽:

插槽名 | 说明
--- | ---
default | 对话框内容
title | 标题内容
footer | 底部内容

### 其他

组件透传 ant-design-vue Modal 的所有属性,常用的有:

- title: 标题
- okText: 确认按钮文字
- cancelText: 取消按钮文字
- maskClosable: 点击蒙层是否允许关闭
