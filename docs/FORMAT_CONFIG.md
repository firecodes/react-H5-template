# 代码格式化配置指南

本项目已完整配置 Prettier 和 ESLint,支持保存自动格式化。

## 📦 已安装的依赖

```json
{
  "devDependencies": {
    "prettier": "^3.x.x",
    "eslint-config-prettier": "^9.x.x",
    "eslint-plugin-prettier": "^5.x.x"
  }
}
```

## 📝 配置文件说明

### 1. Prettier 配置 (`.prettierrc`)

```json
{
  "semi": false, // 不使用分号
  "singleQuote": true, // 使用单引号
  "printWidth": 100, // 每行最大长度 100 字符
  "tabWidth": 2, // 缩进 2 个空格
  "trailingComma": "es5", // ES5 兼容的尾随逗号
  "bracketSpacing": true, // 对象字面量括号内有空格
  "arrowParens": "avoid", // 箭头函数单参数不加括号
  "endOfLine": "lf", // 使用 LF 换行符
  "bracketSameLine": false // JSX 标签闭合括号另起一行
}
```

### 2. ESLint 配置 (`eslint.config.js`)

已集成 Prettier 规则,主要配置:

- ✅ TypeScript 支持
- ✅ React Hooks 规则
- ✅ Prettier 格式化规则
- ✅ 自动修复导入排序
- ⚠️ 警告 `console.log` (允许 `console.warn` 和 `console.error`)
- ⚠️ 警告未使用的变量 (以 `_` 开头的变量除外)

### 3. VSCode 配置 (`.vscode/settings.json`)

自动格式化配置:

```json
{
  "editor.formatOnSave": true, // 保存时自动格式化
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit" // 保存时自动修复 ESLint 错误
  }
}
```

## 🚀 使用方法

### 命令行格式化

```bash
# 格式化所有文件
npm run format

# 检查格式化(不修改文件)
npm run format:check

# 修复 ESLint 错误
npm run lint:fix

# 检查 ESLint 错误
npm run lint
```

### VSCode 自动格式化

1. **安装推荐的扩展**:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier - Code formatter (`esbenp.prettier-vscode`)

2. **保存文件时自动格式化**:
   - 按 `Cmd+S` (Mac) 或 `Ctrl+S` (Windows/Linux) 保存文件
   - 文件会自动应用 Prettier 格式化和 ESLint 修复

3. **手动格式化**:
   - 按 `Shift+Option+F` (Mac) 或 `Shift+Alt+F` (Windows/Linux)
   - 或右键选择 "格式化文档"

## 📋 代码规范

### TypeScript/JavaScript

```typescript
// ✅ 推荐
const greeting = 'Hello World'
const user = { name: 'John', age: 30 }

// ❌ 不推荐
const greeting = 'Hello World'
const user = { name: 'John', age: 30 }
```

### React 组件

```tsx
// ✅ 推荐
export const MyComponent = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>Count: {count}</h1>
    </div>
  )
}

// ❌ 不推荐
export const MyComponent = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="container">
      <h1>Count: {count}</h1>
    </div>
  )
}
```

### 导入语句

```typescript
// ✅ 推荐 - 按字母顺序排列
import { useEffect, useState } from 'react'
import { Button } from 'antd-mobile'
import { useUserStore } from '@/store'

// ❌ 不推荐 - 无序排列
import { Button } from 'antd-mobile'
import { useState, useEffect } from 'react'
import { useUserStore } from '@/store'
```

## 🔧 自定义配置

### 修改 Prettier 规则

编辑 `.prettierrc` 文件:

```json
{
  "semi": true, // 改为使用分号
  "printWidth": 120 // 改为每行 120 字符
}
```

### 修改 ESLint 规则

编辑 `eslint.config.js` 文件的 `rules` 部分:

```javascript
rules: {
  'no-console': 'off',    // 关闭 console 警告
  'prettier/prettier': 'warn'  // 将 Prettier 错误降级为警告
}
```

### 忽略文件

编辑 `.prettierignore` 文件添加需要忽略的文件或目录:

```
# 忽略特定文件
src/legacy/*.js

# 忽略特定目录
temp/
```

## 🐛 常见问题

### 1. 保存时没有自动格式化

**解决方案**:

- 确保已安装 Prettier 扩展
- 检查 VSCode 设置中 `editor.formatOnSave` 是否为 `true`
- 重启 VSCode

### 2. ESLint 和 Prettier 冲突

**解决方案**:

- 本项目已配置 `eslint-config-prettier` 来禁用冲突的规则
- 如果仍有冲突,检查 `eslint.config.js` 中是否正确引入 `prettierConfig`

### 3. 格式化后代码仍有 ESLint 错误

**解决方案**:

- Prettier 只负责代码格式,不处理代码逻辑问题
- 运行 `npm run lint:fix` 尝试自动修复
- 手动修复无法自动修复的错误

### 4. 某些文件不想被格式化

**解决方案**:

- 在文件顶部添加注释:
  ```javascript
  // prettier-ignore
  const uglyCode = { a:1,b:2,c:3 }
  ```
- 或将文件路径添加到 `.prettierignore`

## 📚 相关文档

- [Prettier 官方文档](https://prettier.io/docs/en/index.html)
- [ESLint 官方文档](https://eslint.org/docs/latest/)
- [VSCode ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [VSCode Prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 🎯 最佳实践

1. **提交前格式化**: 在提交代码前运行 `npm run format` 和 `npm run lint:fix`
2. **团队统一**: 确保团队成员都使用相同的配置文件
3. **持续集成**: 在 CI/CD 中添加格式检查: `npm run format:check && npm run lint`
4. **定期更新**: 定期更新 Prettier 和 ESLint 依赖到最新版本
