# SEllipsis 文字省略提示组件

基于 ATooltip 封装，支持实时计算内容是否超出父元素边界，是否文字省略和 Tooltip 提示。

## 基本用法

实时计算内容是否超出父元素边界，是否需要文字省略和 Tooltip 提示。

```vue
<template>
  <ASpace :size="15" :wrap="true" direction="vertical">
    <div class="resize-container" style="width: 172px">
      <SEllipsis>
        一段用来测试 SEllipsis 的文本内容
      </SEllipsis>
    </div>

    <div class="resize-container" style="width: 200px">
      <SEllipsis ellipsis>
        一段用来测试 SEllipsis 的文本内容
      </SEllipsis>
    </div>
  </ASpace>
</template>

<style lang="less" scoped>
.resize-container {
  width: 100%;
  height: 38px;
  padding: 6px 12px;
  box-sizing: border-box;
  border: solid 1px #dddddd;
  border-radius: 5px;
  resize: horizontal;
  cursor: pointer;
  overflow: auto;
}
</style>
```

## API

### Props

参数 | 说明 | 类型 | 默认值
--- | --- | --- | ---
open | 手动控制浮层 | `boolean` | -
title | 提示文字内容 | `string \| slot` | -
color | 背景颜色 | `string` | -
trigger | 触发行为 | `'hover' \| 'focus' \| 'click' \| 'contextmenu'` | `'hover'`
inspect | 是否实时计算内容是否超出父元素边界 | `boolean` | `true`
tooltip | 是否启用 | `boolean` | `true`
ellipsis | 是否文字省略 | `boolean` | `false`
placement | 气泡框位置 | `string` | `'top'`
mouseEnterDelay | 鼠标移入后延时显示，单位：秒 | `number` | `0.3`
mouseLeaveDelay | 鼠标移出后延时隐藏，单位：秒 | `number` | `0.1`

### Slots

插槽名 | 说明 | 参数
--- | --- | ---
default | 默认内容 | -
title | 提示文本 | -
