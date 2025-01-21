import antfu from '@antfu/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default antfu(
  {
    vue: true,
    typescript: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['packages/**/src/**/*.vue', 'packages/**/src/**/*.ts'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
      'jsonc/no-comments': 'off', // 允许 JSON 文件中的注释
      'vue/v-on-event-hyphenation': 0,
      'vue/attribute-hyphenation"': 0,
      'vue/custom-event-name-casing': 0,
      'antfu/top-level-function': 0,
      'vue/padding-line-between-blocks': 0,
      '@typescript-eslint/triple-slash-reference': 0,
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            ['internal', 'unknown'],
            ['parent', 'sibling', 'index', 'object'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'eslintperfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  },
  eslintConfigPrettier,
)
