# 项目结构指南

## 📁 目录结构

```
h5-template-react/
├── public/                      # 静态资源目录
│   └── vite.svg                # 不经过构建的静态文件
│
├── src/                         # 源代码目录
│   ├── services/               # API 接口管理
│   │   ├── index.ts           # API 统一导出
│   │   └── user/              # 用户相关接口模块
│   │       ├── index.ts       # API 方法定义
│   │       └── types.ts       # 类型定义
│   │
│   ├── assets/                 # 资源文件
│   │   ├── images/            # 图片资源
│   │   ├── icons/             # 图标资源
│   │   └── fonts/             # 字体文件
│   │
│   ├── components/             # 公共组件
│   │   ├── Common/            # 通用组件
│   │   └── Business/          # 业务组件
│   │
│   ├── constants/              # 常量定义
│   │   └── index.ts           # 常量统一导出
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   └── index.ts           # Hooks 统一导出
│   │
│   ├── layouts/                # 布局组件
│   │   ├── BasicLayout/       # 基础布局(带导航栏)
│   │   ├── BlankLayout/       # 空白布局
│   │   └── TabLayout/         # 底部 Tab 布局
│   │
│   ├── pages/                  # 页面组件
│   │   ├── home/              # 首页
│   │   │   ├── index.tsx
│   │   │   ├── index.module.less
│   │   │   └── components/    # 页面私有组件
│   │   ├── login/             # 登录页
│   │   ├── about/             # 关于页
│   │   ├── user/              # 用户页
│   │   └── notFound/          # 404 页面
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.tsx          # 路由入口
│   │   ├── routes.tsx         # 路由表配置
│   │   └── AuthGuard.tsx      # 路由守卫
│   │
│   ├── store/                  # 状态管理
│   │   ├── index.ts           # Store 配置和导出
│   │   └── modules/           # 状态模块
│   │       ├── userStore.ts   # 用户状态
│   │       └── appStore.ts    # 应用状态
│   │
│   ├── styles/                 # 全局样式
│   │   ├── index.less         # 样式入口
│   │   ├── variables.less     # 变量定义
│   │   └── reset.less         # 样式重置
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   └── global.d.ts        # 全局类型声明
│   │
│   ├── utils/                  # 工具函数
│   │   ├── index.ts           # 工具函数统一导出
│   │   ├── storage.ts         # 本地存储工具
│   │   ├── format.ts          # 格式化工具
│   │   ├── device.ts          # 设备检测工具
│   │   └── request.ts         # HTTP 请求封装
│   │
│   ├── App.tsx                 # 根组件
│   ├── App.module.less         # 根组件样式
│   └── main.tsx                # 应用入口
│
├── scripts/                     # 脚本工具
│   └── check-api-types.js      # API 类型检测脚本
│
├── docs/                        # 项目文档
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── eslint.config.js            # ESLint 配置
├── index.html                  # HTML 模板
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
└── vite.config.ts              # Vite 配置
```

## 📋 目录职责说明

### `/services` - API 接口层

- **职责**: 管理所有后端接口调用
- **原则**:
  - 按业务模块划分目录
  - 每个模块包含 `index.ts`(API方法) + `types.ts`(类型定义)
  - 类型安全,所有接口都有类型定义
  - HTTP 请求封装在 `/utils/request.ts`

### `/assets` - 静态资源

- **职责**: 存放图片、图标、字体等静态资源
- **原则**:
  - 按类型分类存放
  - 图片建议使用 webp 格式
  - 大图片考虑 CDN 方案

### `/components` - 公共组件

- **职责**: 可复用的 UI 组件
- **原则**:
  - 区分通用组件和业务组件
  - 每个组件一个文件夹
  - 包含组件、样式、类型定义

### `/constants` - 常量配置

- **职责**: 全局常量定义
- **原则**:
  - 避免魔法数字和字符串
  - 按业务领域分类
  - 使用 TS 枚举或对象字面量

### `/hooks` - 自定义 Hooks

- **职责**: 封装可复用的状态逻辑
- **原则**:
  - 遵循 Hooks 命名规范 (use 开头)
  - 单一职责原则
  - 优先使用 ahooks 提供的 Hooks

### `/layouts` - 布局组件

- **职责**: 页面级布局容器
- **原则**:
  - 处理页面通用结构
  - 不包含具体业务逻辑
  - 支持灵活配置

### `/pages` - 页面组件

- **职责**: 应用的各个页面
- **原则**:
  - 目录使用小驼峰命名 (camelCase)
  - 页面私有组件放在 components 子目录
  - 保持组件简洁,逻辑下沉到 hooks 或 store

### `/router` - 路由管理

- **职责**: 路由配置和导航控制
- **原则**:
  - 集中式路由表配置
  - 支持路由元信息
  - 实现路由守卫和权限控制

### `/store` - 状态管理

- **职责**: 全局状态管理 (Zustand)
- **原则**:
  - 按业务模块划分 store
  - 只存储真正需要共享的状态
  - 支持数据持久化

### `/styles` - 全局样式

- **职责**: 全局样式配置
- **原则**:
  - 定义设计系统(颜色、字体、间距等)
  - 提供通用样式类
  - 与 antd-mobile 主题保持一致

### `/types` - 类型定义

- **职责**: TypeScript 类型声明
- **原则**:
  - 复用的类型统一定义
  - 第三方库类型扩展
  - 全局类型声明

### `/utils` - 工具函数

- **职责**: 纯函数工具集和通用工具
- **原则**:
  - 无副作用的纯函数
  - HTTP 请求封装 (request.ts)
  - 完善的单元测试

## 🎯 命名规范

### 1. 文件和目录命名

- **组件文件**: PascalCase (UserCard.tsx)
- **工具文件**: camelCase (useRequest.ts)
- **页面目录**: camelCase (home/, login/, productDetail/)
- **组件目录**: PascalCase (Common/, Business/)
- **常量**: UPPER_SNAKE_CASE

### 2. 代码组织

- 相关文件就近放置
- 避免深层嵌套(不超过 4 层)
- 单一职责原则
- 高内聚低耦合

### 3. 文件大小

- 单个文件不超过 300 行
- 单个函数不超过 50 行
- 复杂逻辑拆分成多个小函数

### 4. 导入顺序

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

## 📊 已完成的功能模块

### 1. API 接口层

- ✅ 用户模块 API 示例
- ✅ TypeScript 类型安全
- ✅ HTTP 请求封装
- ✅ 请求/响应拦截器
- ✅ 统一错误处理

### 2. 路由系统

- ✅ React Router v6 集成
- ✅ 集中式路由表配置
- ✅ 路由守卫 (权限控制)
- ✅ 路由元信息支持
- ✅ Hash 模式 (移动端友好)

### 3. 工具函数库

- ✅ HTTP 请求封装 (Axios + 拦截器)
- ✅ 本地存储工具 (支持过期时间)
- ✅ 设备检测工具 (iOS, Android, 微信等)
- ✅ 格式化工具 (手机号, 金额, 日期等)

### 4. 自定义 Hooks

- ✅ 基于 ahooks (70+ 个高质量 Hooks)
- ✅ useRequest - 请求管理
- ✅ useDebounce - 防抖处理
- ✅ useLocalStorageState - 持久化状态

### 5. 样式系统

- ✅ 全局样式重置
- ✅ Less 变量定义
- ✅ PostCSS px 转 rem (移动端适配)
- ✅ antd-mobile 主题集成
- ✅ BEM 命名规范

### 6. 状态管理 (Zustand)

- ✅ userStore - 用户状态管理
- ✅ appStore - 应用全局状态
- ✅ 数据持久化
- ✅ 与路由守卫集成

### 7. 开发配置

- ✅ 环境变量配置
- ✅ 路径别名 (@/)
- ✅ ESLint 代码规范
- ✅ TypeScript 严格模式

## 🔧 推荐的 npm scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "build:test": "tsc -b && vite build --mode test",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "type-check": "tsc --noEmit",
  "check:types": "node scripts/check-api-types.js"
}
```

## 📚 相关文档

- [快速开始指南](./QUICK_START.md) - 5分钟快速上手
- [API 开发规范](./API_GUIDE.md) - Services 模块开发规范
- [页面开发规范](./PAGE_GUIDE.md) - 页面目录和样式规范
- [状态管理指南](./ZUSTAND_GUIDE.md) - Zustand 使用指南
