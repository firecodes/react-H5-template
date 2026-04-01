# Git Commit 规范配置说明

本文档说明项目中 Git Commit 规范的技术实现和配置细节。

## 📦 已安装的依赖包

```json
{
  "devDependencies": {
    "husky": "^9.1.7", // Git Hooks 管理
    "lint-staged": "^16.2.6", // 暂存文件检查
    "@commitlint/cli": "^20.1.0", // Commit 消息验证
    "@commitlint/config-conventional": "^20.0.0", // Conventional Commits 配置
    "commitizen": "^4.3.1", // 交互式提交工具
    "cz-conventional-changelog": "^3.3.0", // Commitizen 适配器
    "standard-version": "^9.5.0" // 版本管理和 CHANGELOG 生成
  }
}
```

## 🔧 配置文件

### 1. commitlint.config.js

Commit 消息验证规则配置。

**位置**: 项目根目录

**主要配置**:

- 继承 `@commitlint/config-conventional`
- 支持的 type: feat, fix, docs, style, refactor, perf, test, chore, revert, build, ci
- Header 最大长度: 100 字符
- Body/Footer 每行最大长度: 100 字符

### 2. .lintstagedrc.json

暂存文件检查配置。

**位置**: 项目根目录

**检查规则**:

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix", // ESLint 自动修复
    "prettier --write", // Prettier 格式化
    "bash -c 'tsc --noEmit'" // TypeScript 类型检查
  ],
  "*.{less,css}": ["prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### 3. .versionrc.json

Standard Version 配置，用于生成 CHANGELOG。

**位置**: 项目根目录

**主要配置**:

- 定义 CHANGELOG 中的提交类型分组
- 配置版本号升级规则
- 自定义 CHANGELOG 格式

### 4. .husky/

Git Hooks 配置目录。

**位置**: 项目根目录

**包含的 Hooks**:

- `pre-commit`: 提交前执行 `npx lint-staged`
- `commit-msg`: 提交时执行 `npx --no -- commitlint --edit $1`

## 🚀 NPM Scripts

```json
{
  "scripts": {
    "prepare": "husky", // npm install 后自动安装 husky
    "commit": "git-cz", // 交互式提交
    "changelog": "standard-version", // 生成 CHANGELOG
    "lint:staged": "lint-staged" // 手动执行 lint-staged
  }
}
```

## 🔄 工作流程

### 提交流程

```
开发者执行 git commit
        ↓
pre-commit Hook 触发
        ↓
lint-staged 执行
        ↓
对暂存文件执行:
  - ESLint 修复
  - Prettier 格式化
  - TypeScript 类型检查
        ↓
检查通过？
  ├─ 是 → 继续
  └─ 否 → 中止提交，显示错误
        ↓
commit-msg Hook 触发
        ↓
commitlint 验证消息格式
        ↓
格式正确？
  ├─ 是 → 提交成功
  └─ 否 → 中止提交，显示错误
```

### CHANGELOG 生成流程

```
执行 npm run changelog
        ↓
standard-version 分析 git 历史
        ↓
根据 Conventional Commits 分类提交
        ↓
确定版本号升级类型:
  - BREAKING CHANGE → major (1.0.0 → 2.0.0)
  - feat → minor (1.0.0 → 1.1.0)
  - fix → patch (1.0.0 → 1.0.1)
        ↓
更新 package.json 版本号
        ↓
生成/更新 CHANGELOG.md
        ↓
创建 git commit 和 tag
```

## 🎯 验证配置

### 测试 commitlint

```bash
# 测试正确的消息格式
echo "feat: 测试功能" | npx commitlint
# 应该通过

# 测试错误的消息格式
echo "错误的消息" | npx commitlint
# 应该失败，显示错误信息
```

### 测试 lint-staged

```bash
# 手动执行 lint-staged
npm run lint:staged
```

### 测试 commitizen

```bash
# 启动交互式提交
npm run commit
```

## 📋 配置检查清单

- [x] 安装所有必需的 npm 包
- [x] 创建 `commitlint.config.js`
- [x] 创建 `.lintstagedrc.json`
- [x] 创建 `.versionrc.json`
- [x] 配置 package.json scripts
- [x] 初始化 husky
- [x] 创建 `.husky/pre-commit`
- [x] 创建 `.husky/commit-msg`
- [x] 更新 `.gitignore`
- [x] 创建文档 `docs/GIT_COMMIT_GUIDE.md`
- [x] 更新 `README.md`
- [x] 创建 `CHANGELOG.md` 模板

## 🔍 故障排查

### 问题 1: Husky hooks 不执行

**原因**: hooks 文件没有执行权限

**解决**:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### 问题 2: lint-staged 类型检查失败

**原因**: TypeScript 配置问题

**解决**:

```bash
# 检查 tsconfig.json 是否正确
npm run build

# 修复类型错误后重新提交
```

### 问题 3: commitlint 验证失败

**原因**: 提交消息格式不符合规范

**解决**:

- 使用 `npm run commit` 交互式提交
- 参考 [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md) 了解正确格式

### 问题 4: 需要跳过 hooks（紧急情况）

**解决**:

```bash
# 跳过所有 hooks（不推荐）
git commit --no-verify -m "feat: 紧急修复"
```

## 🔗 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Standard Version](https://github.com/conventional-changelog/standard-version)

## 📝 维护说明

### 修改 commitlint 规则

编辑 `commitlint.config.js`:

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 添加或修改规则
    'type-enum': [2, 'always', ['feat', 'fix' /* 更多类型 */]],
  },
}
```

### 修改 lint-staged 规则

编辑 `.lintstagedrc.json`:

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix"
    // 添加更多命令
  ]
}
```

### 修改 CHANGELOG 格式

编辑 `.versionrc.json`:

```json
{
  "types": [
    { "type": "feat", "section": "✨ 新功能" }
    // 修改或添加更多类型
  ]
}
```

## 🎉 总结

本项目已完整配置 Git Commit 规范，包括：

1. ✅ **自动代码检查**: 提交前自动执行 ESLint、Prettier、TypeScript 检查
2. ✅ **提交消息验证**: 自动验证 Commit 消息格式
3. ✅ **交互式提交**: 使用 Commitizen 简化提交流程
4. ✅ **自动生成 CHANGELOG**: 基于 Conventional Commits 自动生成版本日志
5. ✅ **完整文档**: 提供详细的使用指南和故障排查

开发者只需使用 `npm run commit` 即可享受规范化的提交流程！
