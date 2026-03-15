// 导入 ESLint 官方推荐规则集（适用于 JS 基础规则）
import js from '@eslint/js'

// 导入常见的全局变量定义（如 window、document 等）
import globals from 'globals'

// 导入 Vue 官方的 ESLint 插件，用于支持 Vue 文件的语法校验
import pluginVue from 'eslint-plugin-vue'

// 从 ESLint 配置模块中导入 defineConfig 和 globalIgnores，用于定义配置和全局忽略规则
import { defineConfig, globalIgnores } from 'eslint/config'

// 导入 Prettier 插件，用于整合代码格式化规则
import eslintPluginPrettier from 'eslint-plugin-prettier'

// 导入 Prettier 官方 ESLint 配置，用于关闭与 Prettier 冲突的规则
import prettierConfig from 'eslint-config-prettier'

// 使用 defineConfig 定义 ESLint 配置（ESLint v8+ 的新写法）
export default defineConfig([
  {
    // 配置名称，仅用于区分不同部分的配置（可选）
    name: 'app/files-to-lint',

    // 指定需要 ESLint 校验的文件类型
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  // 配置全局忽略的文件或目录（例如打包结果、测试覆盖率文件）
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    // 语言选项配置
    languageOptions: {
      globals: {
        // 引入浏览器环境的全局变量（如 window、document 等）
        ...globals.browser,
        // 声明项目中常用的 Element Plus 全局对象为只读，防止 ESLint 报“未定义变量”错误
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      }
    }
  },

  // 加载 ESLint 官方推荐的 JS 校验规则
  js.configs.recommended,

  // 加载 Vue 官方推荐的基础规则（flat 模式）
  ...pluginVue.configs['flat/essential'],

  // 集成 Prettier 插件（用于让 ESLint 能检测 Prettier 格式问题）
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      // 启用 Prettier 的格式校验规则（只警告，不报错）
      'prettier/prettier': 'warn',

      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 1,
          multiline: 1
        }
      ],

      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      // Vue 组件命名规则：必须为多单词（防止与原生元素冲突）
      'vue/multi-word-component-names': [
        'warn',
        {
          // 忽略 index.vue（常用作页面入口）
          ignores: ['index']
        }
      ],
      // 关闭 props 解构校验（允许在 setup 中使用解构语法）
      'vue/no-setup-props-destructure': ['off'],

      // 添加未定义变量的错误提示（在 create-vue@3.6.3 默认关闭）
      // 这里重新启用是为了演示后续章节功能
      'no-undef': 'error'
    }
  },

  // 最后集成 Prettier 配置，用于覆盖 ESLint 中与 Prettier 冲突的规则
  prettierConfig
])
