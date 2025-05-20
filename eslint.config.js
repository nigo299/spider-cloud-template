// 导入 antfu 的 ESLint 配置，这是一个流行的 ESLint 配置预设
import antfu from '@antfu/eslint-config'
// 导入 eslint-config-prettier，用于解决 ESLint 和 Prettier 的规则冲突
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

// 导出 ESLint 配置
export default antfu(
  {
    // 启用 Vue 相关的 lint 规则
    vue: true,
    // 启用 TypeScript 相关的 lint 规则
    typescript: true,
  },
  // 合并 Prettier 配置，确保 ESLint 规则不会与 Prettier 格式化产生冲突
  eslintConfigPrettier,
  {
    // 指定规则应用的文件范围
    files: ['packages/**/src/**/*.vue', 'packages/**/src/**/*.ts'],
    rules: {
      // 要求操作符换行时在操作符之前换行
      'vue/operator-linebreak': ['error', 'before'],
      // 允许在 JSON 文件中使用注释
      'jsonc/no-comments': 'off',
      // 关闭事件名称连字符检查
      'vue/v-on-event-hyphenation': 0,
      // 关闭属性名称连字符检查
      'vue/attribute-hyphenation': 0,
      // 关闭自定义事件名称大小写检查
      'vue/custom-event-name-casing': 0,
      // 关闭顶层函数声明规则
      'antfu/top-level-function': 0,
      // 关闭 Vue 块之间的空行要求
      'vue/padding-line-between-blocks': 0,
      // 允许使用三斜线指令引用
      '@typescript-eslint/triple-slash-reference': 0,
      // 设置语句之间的空行规则
      'padding-line-between-statements': [
        'error',
        // 在任何语句和 export 语句之间添加空行
        { blankLine: 'always', prev: '*', next: 'export' },
        // 在任何语句和函数声明之间添加空行
        { blankLine: 'always', prev: '*', next: 'function' },
        // 在任何语句和多行块之间添加空行
        { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
      ],
      // 配置 import 语句的排序规则
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 内置模块
            'external', // 外部安装的依赖
            'internal', // 内部模块
            'parent', // 父级目录模块
            'sibling', // 同级目录模块
            'index', // 当前目录模块
            'type', // 类型导入
            'object', // 对象导入
            'unknown', // 未知类型导入
          ],
          'newlines-between': 'always', // 不同组之间添加空行
          alphabetize: { order: 'asc' }, // 按字母升序排序
        },
      ],
      // 禁用 perfectionist 插件的 import 排序规则，因为已经使用了 import/order
      'perfectionist/sort-imports': 'off',
      // Vue 3 相关最佳实践规则
      'vue/no-deprecated-dollar-listeners-api': 'error',
      'vue/no-deprecated-dollar-scopedslots-api': 'error',
      'vue/no-deprecated-events-api': 'error',
      'vue/no-deprecated-filter': 'error',
      'vue/no-deprecated-functional-template': 'error',
      'vue/no-deprecated-html-element-is': 'error',
      'vue/no-deprecated-props-default-this': 'error',
      'vue/no-deprecated-v-bind-sync': 'error',
      'vue/no-deprecated-v-on-native-modifier': 'error',
      'vue/no-lifecycle-after-await': 'error',
      'vue/no-ref-as-operand': 'error',
      'vue/no-setup-props-destructure': 'warn', // 只警告，因为Vue 3.3+可以解构props
      'vue/no-v-for-template-key-on-child': 'error',
      'vue/no-watch-after-await': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/require-toggle-inside-transition': 'error',
      'vue/script-setup-uses-vars': 'error',
      // 添加Prettier作为ESLint插件
      'prettier/prettier': ['warn'],
    },
    ignores: ['node_modules', 'dist', '.vite', '.husky'], // 扩展忽略配置
    plugins: {
      prettier: eslintPluginPrettier,
    },
  },
  {
    rules: {
      // 配置分号使用规则：禁止使用分号
      'style/semi': ['error', 'never'],
    },
  }
)
