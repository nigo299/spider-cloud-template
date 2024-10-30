# spider-cloud-frontend-vue

<p align='center'>
Modern frontend development template based on Vue 3 + TypeScript
</p>

<br>

## Features

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/) - Modern development experience

- 📱 Support for both PC and mobile modes

- 🍍 [State management with Pinia](https://pinia.vuejs.org)

- 🎨 [Less](https://lesscss.org/) - CSS preprocessor

- 🔥 [New `<script setup>` syntax](https://github.com/vuejs/rfcs/pull/227)

- 📥 [Axios](https://axios-http.com/) - HTTP client

- 🔄 [SWRV](https://docs-swrv.netlify.app/) - Vue Hooks library for data fetching

## IDE Recommendation

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### TypeScript Vue Plugin Setup

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window`

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

For PC development:

```bash
pnpm start:pc
```

For mobile development:

```bash
pnpm start:h5
```

### Testing

```bash
pnpm test:unit
```

### Linting

```bash
pnpm lint
```

### Commit Code

```bash
pnpm commit
```

## Tech Stack

- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Pinia](https://pinia.vuejs.org/) - State management for Vue
- [Axios](https://axios-http.com/) - Promise based HTTP client
- [SWRV](https://docs-swrv.netlify.app/) - Vue Hooks library for data fetching
- [Less](https://lesscss.org/) - CSS preprocessor
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [UnoCSS](https://github.com/unocss/unocss) - Atomic CSS engine
- [OxLint](https://github.com/oxc-project/oxlint) - Code linting tool
- [Ant-design-vue](https://antdv.com/docs/vue/introduce) - Enterprise-class UI components
- [VueUse](https://vueuse.org/) - Collection of Vue Composition Utilities

## Configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Usage Notes

- Ensure Node.js version >= 16.18
- Recommended to use pnpm as package manager
- Follow the project's established code and commit conventions
