# 简介

- 🆒 使用 **Vue3** 主流最新技术栈: `Vite + Vue3 + Pinia`
- 🍇 使用 **原子CSS**框架: `Unocss`，优雅、轻量、易用
- 🍍 集成 `Pinia` 状态管理，支持状态持久化
- 🤹 使用主流的 `iconify + unocss` 图标方案，支持自定义图标，支持动态渲染
- 🎨 使用 Naive UI，`极致简洁的代码风格和清爽的页面设计`，审美在线，主题轻松定制
- 👏 先进且易于理解的文件结构设计，多个模块之间**零耦合**，单个业务模块删除不影响其他模块
- 🚀 `扁平化路由`设计，每一个组件都可以是一个页面，告别多级路由 `KeepAlive` 难实现问题
- ✨ 基于 Naive UI 封装 `message` 全局工具方法，支持批量提醒，支持跨页面单例模式
- ⚡️ 基于 Naive UI 封装常用的业务组件，包含`Page` 组件、`CRUD` 表格组件及 `Modal`组件等，简单易用，减少大量重复性工作

## 图标使用指南

本项目使用 `UnoCSS + Iconify` 图标解决方案，支持丰富的图标集合和自定义图标。

### 图标使用方式

1. **基本语法**：`i-{集合}-{图标名}`

   ```vue
   <div class="i-carbon-home text-24"></div>
   ```

2. **支持的图标集合**

   - **Iconify官方图标**：项目已集成所有Iconify图标，如`i-carbon-home`、`i-mdi-account`
   - **自定义集合**：
     - `me`集合：`i-me-{图标名}`，存放在`src/assets/icons/isme`目录
     - `fe`集合：`i-fe-{图标名}`，存放在`src/assets/icons/feather`目录

3. **动态图标**

   - 需要动态渲染的图标在`src/assets/icons/dynamic-icons.ts`中注册

   ```ts
   // 注册示例
   const dynamicIcons: string[] = ['i-simple-icons:github', 'i-carbon-home']
   ```

4. **常用图标集推荐**

   - Carbon图标(IBM设计系统)：`i-carbon-xxx`
   - Material Design Icons：`i-mdi-xxx`
   - Simple Icons(品牌图标)：`i-simple-icons:xxx`
   - Feather图标(简洁线性)：`i-fe-xxx`

5. **图标尺寸和颜色**

   ```vue
   <!-- 设置图标大小 -->
   <div class="i-carbon-home text-24"></div>

   <!-- 设置图标颜色 -->
   <div class="i-carbon-warning text-red-500"></div>

   <!-- 动态图标示例 -->
   <div :class="isDark ? 'i-carbon-moon' : 'i-carbon-sun'"></div>
   ```

6. **图标在线查找工具**

   - [Icônes](https://icones.js.org/) - 最全面的Iconify图标预览工具
   - [Iconify官网](https://icon-sets.iconify.design/) - Iconify官方图标浏览器

7. **添加自定义图标**

   - 将SVG文件放入对应目录：`src/assets/icons/isme/`或`src/assets/icons/feather/`
   - 使用方式：`i-me-{文件名}`或`i-fe-{文件名}`

8. **在组件中使用**

   ```vue
   <n-button>
     <template #icon>
       <i class="i-carbon-settings"></i>
     </template>
     设置
   </n-button>
   ```
