# board-frontend-ie11

## 背景

基于 Vue 2.7 和 Vite 的基础模板，支持 IE11 浏览器。

## 特性

- 完善的 TypeScript 和 `<script setup>` 语法糖支持
- VueUse 开箱即用
- 使用 Vite 进行开发和打包
- 打包产物支持 IE11
- 基于文件系统的路由
- 组件自动导入
- 组合式 API 自动导入
- UnoCSS 支持
- 纯 CSS 的图标（IE11 部分支持）
- CSS Variables Polyfill（仅 IE11）
- 使用 swrv 增强请求
- 使用 pinia 管理状态
- antd-vue 1.x 版本支持(考虑到代码迁移便捷性暂不进行tree-shaking处理)
- echart 4.x 版本支持

## 开发说明

- 由于 Vite 的特性，开发模式下生成的代码不支持 IE11下运行。因此，在开发过程中无法在 IE11 中运行 Vite 项目。只能 `pnpm build` 命令进行打包，然后在 IE11 中对打包后的代码进行调试。
- 由于大量针对低版本浏览器的兼容性配置，不要对关键依赖进行升级，否则可能会导致兼容性问题。
