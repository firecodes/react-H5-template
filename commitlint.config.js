/**
 * Commitlint 配置
 * 使用 Conventional Commits 规范
 * @see https://commitlint.js.org/
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type 枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修复 bug）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 构建系统或外部依赖的变动
        'ci', // CI 配置文件和脚本的变动
      ],
    ],
    // Type 必须小写
    'type-case': [2, 'always', 'lower-case'],
    // Type 不能为空
    'type-empty': [2, 'never'],
    // Scope 必须小写
    'scope-case': [2, 'always', 'lower-case'],
    // Subject 不能为空
    'subject-empty': [2, 'never'],
    // Subject 不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // Subject 首字母不限制大小写
    'subject-case': [0],
    // Header 最大长度 100
    'header-max-length': [2, 'always', 100],
    // Body 每行最大长度 100
    'body-max-line-length': [2, 'always', 100],
    // Footer 每行最大长度 100
    'footer-max-line-length': [2, 'always', 100],
  },
}
