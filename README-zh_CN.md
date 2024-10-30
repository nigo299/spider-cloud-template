# spider-cloud-frontend-vue

<p align='center'>
基于 Vue 3 + TypeScript 的现代化前端开发模板
</p>

<br>

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/) - 现代化的开发体验

- 📱 支持PC端和移动端两种模式

- 🍍 [使用 Pinia 的状态管理](https://pinia.vuejs.org)

- 🎨 [Less](https://lesscss.org/) - CSS 预处理器

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [Axios](https://axios-http.com/) - 请求库

- 🔄 [SWRV](https://docs-swrv.netlify.app/) - 用于数据请求的 Vue Hooks 库

## IDE 推荐

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### TypeScript Vue 插件设置

1. 禁用内置的 TypeScript 扩展
   1. 从 VSCode 的命令面板运行 `Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features`，右键单击并选择 `Disable (Workspace)`
2. 通过运行 `Developer: Reload Window` 重新加载 VSCode 窗口

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发

PC端开发:

```bash
pnpm start:pc
```

移动端开发:

```bash
pnpm start:h5
```

### 测试

```bash
pnpm test:unit
```

### 代码检查

```bash
pnpm lint
```

### 提交代码

```bash
pnpm commit
```

## 技术栈

- [Vue 3](https://cn.vuejs.org/) - 渐进式 JavaScript 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端
- [SWRV](https://docs-swrv.netlify.app/) - 用于数据请求的 Vue Hooks 库
- [Less](https://lesscss.org/) - CSS 预处理器
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [UnoCSS](https://github.com/unocss/unocss) - 原子 CSS 引擎
- [OxLint](https://github.com/oxc-project/oxlint) - 代码检查工具
- [Ant-design-vue](https://antdv.com/docs/vue/introduce) - 企业级 UI 组件库
- [VueUse](https://vueuse.org/) - Vue 的实用函数库

## 配置

查看 [Vite 配置参考](https://vitejs.dev/config/)。

## 使用须知

- 确保 Node.js 版本 >= 16.18
- 推荐使用 pnpm 作为包管理器
- 遵循项目既定的代码规范和提交规范
