# spider-cloud-frontend-vue

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 用于`.vue`导入的 TS 类型支持

由于 TypeScript 默认无法处理`.vue`导入的类型信息，因此我们用`vue-tsc`替换了`tsc` CLI 进行类型检查。在编辑器中，我们需要[TypeScript Vue 插件（Volar）](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)以使 TypeScript 语言服务了解`.vue`类型。

如果独立的 TypeScript 插件对您来说不够快，请注意 Volar 还实现了[Take Over 模式](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)，这更具性能。您可以按照以下步骤启用它：

1. 禁用内置的 TypeScript 扩展
   1. 从 VSCode 的命令面板运行 `Extensions: Show Built-in Extensions`
   2. 找到 `TypeScript and JavaScript Language Features`，右键单击并选择 `Disable (Workspace)`
2. 通过运行 `Developer: Reload Window` 重新加载 VSCode 窗口。

## 自定义配置

请参阅[Vite 配置参考](https://vitejs.dev/config/)。

## 项目设置

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm start:pc
```

```sh
pnpm start:h5
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### code commit

```sh
pnpm commit
```

### 工具库

- [vue3](https://cn.vuejs.org/guide/introduction.html)
- [pinia](https://pinia.vuejs.org/)
- [axios](https://axios-http.com/docs/intro)
- [swrv](https://docs-swrv.netlify.app/)
- [less](https://lesscss.org/)
- [typescript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
