# H5 Template React

基于 React 18 + TypeScript + Vite + antd-mobile 的移动端 H5 项目模板。

## ✨ 特性

- ⚡️ **Vite** - 极速的开发体验
- ⚛️ **React 18** - 最新的 React 特性
- 📱 **antd-mobile** - 专业的移动端 UI 组件库
- 🎨 **Less** - CSS 预处理器
- 📦 **TypeScript** - 类型安全
- 🛣️ **React Router** - 路由管理
- 🗃️ **Zustand** - 轻量级状态管理
- 🔄 **Axios** - HTTP 请求封装
- 📐 **PostCSS** - 自动 px 转 rem 适配
- 🎯 **ESLint + Prettier** - 代码规范和格式化
- 🔒 **Git Hooks** - 提交前自动检查代码质量
- 📝 **Commitlint** - 规范化 Git 提交信息
- 📂 **最佳实践目录结构** - 清晰的代码组织

## 📦 技术栈

- React 18.3.1
- TypeScript 5.9.3
- Vite 7.x
- React Router 6.x
- antd-mobile 5.x
- Zustand 5.x - 状态管理
- ahooks 3.x - React Hooks 工具库
- Axios - HTTP 请求
- Less - CSS 预处理
- PostCSS + postcss-pxtorem - 移动端适配

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run format

# Prettier 检查
npm run format:check
```

### Git 提交

```bash
# 使用 Commitizen 交互式提交（推荐）
npm run commit

# 生成 CHANGELOG 并升级版本
npm run changelog
```

## 📁 项目结构

详细的项目结构说明请查看 [PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md)

```
src/
├── services/               # API 接口管理
├── assets/                 # 静态资源
├── components/             # 公共组件
├── constants/              # 常量定义
├── hooks/                  # 自定义 Hooks (基于 ahooks)
├── layouts/                # 布局组件
├── pages/                  # 页面组件 (小驼峰命名)
│   ├── home/              # 首页
│   ├── login/             # 登录页
│   ├── about/             # 关于页
│   ├── user/              # 用户页
│   └── notFound/          # 404页
├── router/                 # 路由配置
├── store/                  # 状态管理 (Zustand)
├── styles/                 # 全局样式
├── types/                  # 类型定义
├── utils/                  # 工具函数
├── App.tsx                 # 根组件
└── main.tsx                # 应用入口
```

## 🔧 配置说明

### 环境变量

项目支持多环境配置,通过不同的 `.env` 文件管理:

- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

### 移动端适配

项目使用 `postcss-pxtorem` 自动将 px 转换为 rem,基准值为 37.5(基于 375px 设计稿)。

在开发时直接使用 px 单位即可,构建时会自动转换。

### 路径别名

已配置 `@` 别名指向 `src` 目录:

```typescript
import { UserAPI } from '@/services'
import { useRequest } from '@/hooks'
```

## 📖 开发指南

### 创建新页面

1. 在 `src/pages/` 下创建页面目录（使用小驼峰命名，如 `productDetail/`）
2. 创建必需文件：`index.tsx`、`index.module.less`、`components/` 目录
3. 在 `src/router/routes.tsx` 中配置路由

详细规范请查看 [页面开发规范](./docs/PAGE_GUIDE.md)

### API 接口调用

```typescript
import { UserAPI } from '@/services'

// 在组件中使用
const handleLogin = async () => {
  const res = await UserAPI.login({ username, password })
  console.log(res)
}
```

### 使用 Hooks (基于 ahooks)

项目使用 [ahooks](https://ahooks.js.org/) 提供 70+ 个高质量 React Hooks。

```typescript
import { useRequest, useDebounce, useLocalStorageState } from '@/hooks'
import { UserAPI } from '@/services'

function UserPage() {
  // 请求管理
  const { data, loading, run } = useRequest(UserAPI.getUserInfo)

  // 防抖
  const debouncedValue = useDebounce(searchText, { wait: 500 })

  // 持久化状态
  const [theme, setTheme] = useLocalStorageState('theme', {
    defaultValue: 'light',
  })

  useEffect(() => {
    run()
  }, [])

  if (loading) return <Loading />
  return <div>{data?.username}</div>
}
```

### 使用工具函数

```typescript
import { formatPhone, formatDate, storage } from '@/utils'

// 格式化手机号
const phone = formatPhone('13800138000') // 138****8000

// 格式化日期
const date = formatDate(Date.now()) // 2024-01-01 12:00:00

// 本地存储
storage.set('token', 'xxx', 3600) // 保存 1 小时
const token = storage.get('token')
```

### 使用 Zustand 状态管理

```typescript
import { useUserStore, useIsLogin } from '@/store'

function MyPage() {
  const isLogin = useIsLogin()
  const { login, logout } = useUserStore()

  // 登录
  const handleLogin = () => {
    login('token', { id: 1, username: 'user', email: 'user@example.com' })
  }

  // 登出
  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <p>登录状态: {isLogin ? '已登录' : '未登录'}</p>
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  )
}
```

详细使用说明请查看 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)

## 🎨 代码规范

### 命名规范

- **组件文件**: PascalCase (如 `UserCard.tsx`)
- **工具文件**: camelCase (如 `useRequest.ts`)
- **页面目录**: camelCase (如 `home/`, `productDetail/`)
- **组件目录**: PascalCase (如 `Common/`, `Business/`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

详细规范请查看 [项目结构指南](./docs/PROJECT_GUIDE.md)

### 导入顺序

```typescript
// 1. 第三方库
import React from 'react'
import { Button } from 'antd-mobile'

// 2. 项目内部模块(使用别名)
import { useRequest } from '@/hooks'
import { UserAPI } from '@/services'

// 3. 相对路径导入
import styles from './index.module.less'
```

## 📝 常见问题

### 如何配置代理?

在 `vite.config.ts` 中配置:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### 如何自定义主题?

修改 `src/styles/variables.less` 中的变量值。

## 📄 文档

### 📚 核心文档

- **[文档索引](./docs/README.md)** - 所有文档的导航入口
- **[快速开始](./docs/QUICK_START.md)** - 5 分钟快速上手指南
- **[项目结构](./docs/PROJECT_GUIDE.md)** - 完整的项目结构说明

### 📖 开发规范

- **[React 开发规范](./docs/REACT_GUIDE.md)** - 组件开发和代码风格规范
- **[API 开发规范](./docs/API_GUIDE.md)** - Services 模块开发规范
- **[页面开发规范](./docs/PAGE_GUIDE.md)** - 页面目录和样式规范
- **[状态管理指南](./docs/ZUSTAND_GUIDE.md)** - Zustand 使用指南
- **[Git 提交规范](./docs/GIT_COMMIT_GUIDE.md)** - Git Commit 规范和工具使用

### 🎯 按场景查找

- **开发新功能**: 快速开始 → React 规范 → API 规范 → 页面规范
- **了解项目**: 项目结构 → 快速开始
- **规范代码**: React 规范 → API 规范 → 页面规范

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 来改进这个项目。

## 📄 License

MIT
