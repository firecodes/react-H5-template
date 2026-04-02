# 移动端H5应用

一个基于React + Vite + Ant Design Mobile + Tailwind CSS的现代化移动端H5应用。

## ✨ 特性

- 🚀 **现代技术栈**: React 19 + TypeScript + Vite 7
- 📱 **移动端优化**: Ant Design Mobile + 响应式设计
- 🎨 **样式系统**: Tailwind CSS + 移动端适配
- 🗂️ **状态管理**: Redux Toolkit + Redux Persist
- 🛠️ **开发工具**: ESLint + TypeScript + 路径别名
- 🗜️ **性能优化**: Gzip + Brotli 压缩 (节省76.2%带宽)
- 📦 **类型安全**: 完整的TypeScript类型定义

## 🚀 快速开始

> 💡 **推荐使用 Yarn**：相比npm，Yarn具有更快的安装速度、更好的依赖解析和更稳定的lockfile管理。

### 前置要求
如果您还没有安装Yarn，请先安装：
```bash
# 使用npm全局安装
npm install -g yarn

# 或使用官方安装脚本
curl -o- -L https://yarnpkg.com/install.sh | bash
```

### 安装依赖
```bash
yarn install
# 或简写为
yarn
```

### 开发
```bash
yarn dev
```

### 构建
```bash
# 标准构建
yarn build

# 构建并查看压缩报告
yarn build:compress

# 预览构建结果
yarn preview
```

## 📁 项目结构

```
src/
├── assets/            # 静态资源
├── components/        # 公共组件
│   ├── Button/        # 按钮组件
│   ├── Loading/       # 加载组件
│   └── index.ts       # 组件导出
├── hooks/             # 自定义hooks
│   └── useDebounce.ts # 防抖hook
├── layouts/           # 页面布局
│   └── BasicLayout.tsx
├── pages/             # 页面组件
│   ├── Home/          # 首页
│   └── Profile/       # 个人中心
├── services/          # API服务
│   ├── api.ts         # API封装
│   └── userService.ts # 用户API
├── store/             # Redux状态管理
│   ├── index.ts       # Store配置
│   └── slices/        # 状态切片
├── styles/            # 全局样式
│   ├── global.css     # 全局样式
│   └── tailwind.css   # Tailwind配置
├── types/             # TypeScript类型定义
│   ├── api.ts         # API类型
│   ├── components.ts  # 组件类型
│   ├── global.d.ts    # 全局类型
│   ├── vite-env.d.ts  # Vite环境类型
│   └── index.ts       # 类型导出
├── utils/             # 工具函数
│   ├── classnames.ts  # 样式工具
│   └── index.ts       # 工具函数导出
├── App.tsx            # 主应用组件
└── main.tsx           # 入口文件
```

## 🎯 技术栈

### 核心技术
- **React 19** - 现代React框架
- **TypeScript** - 类型安全
- **Vite 7** - 快速构建工具

### UI框架
- **Ant Design Mobile** - 移动端组件库
- **Tailwind CSS** - 原子化CSS框架

### 状态管理
- **Redux Toolkit** - 现代Redux工具集
- **Redux Persist** - 状态持久化

### 工具链
- **ESLint** - 代码规范
- **PostCSS** - CSS处理
- **Terser** - 代码压缩
- **Yarn** - 包管理器（推荐）

## 🗜️ 压缩优化

项目配置了完整的压缩优化：

### 压缩效果
- **Gzip压缩**: 节省 72.6% 带宽
- **Brotli压缩**: 节省 76.2% 带宽
- **代码分包**: 按功能模块分包加载

### 构建分析
```bash
# 查看压缩效果报告
yarn build:report

# 完整构建+分析
yarn build:compress
```

## 📱 移动端适配

### 响应式设计
- 基于375px设计稿
- 自动px转vw适配
- 支持安全区域适配

### 兼容性
- 现代移动浏览器
- iOS Safari 12+
- Android Chrome 80+

## 🎨 样式系统

### Tailwind CSS
- 完全使用Tailwind工具类
- 移除所有自定义CSS文件
- 响应式断点配置

### 自定义工具
```typescript
import { cn, conditional, commonClasses } from '@/utils'

// 基础用法
<div className={cn('p-4', 'rounded-lg', 'bg-blue-50')} />

// 条件样式
<div className={cn('base-class', {
  'active-class': isActive,
  'disabled-class': isDisabled
})} />

// 预定义样式
<div className={commonClasses.card.base} />
```

## 🔧 开发配置

### 包管理器 (Yarn)
推荐使用Yarn作为包管理器，带来以下优势：

#### 性能优势
- **并行安装**: 多个包同时下载和安装
- **缓存机制**: 已下载的包会被缓存，重复安装更快
- **离线模式**: 已缓存的包支持离线安装

#### 稳定性优势
- **确定性安装**: `yarn.lock` 确保所有环境安装相同版本
- **版本解析**: 更智能的依赖版本解析算法
- **完整性校验**: 自动验证包的完整性

#### 常用命令
```bash
# 安装依赖
yarn install

# 添加依赖
yarn add package-name
yarn add -D package-name  # 开发依赖

# 删除依赖
yarn remove package-name

# 升级依赖
yarn upgrade
yarn upgrade package-name

# 查看依赖
yarn list
yarn why package-name  # 查看为什么安装了某个包
```

### 路径别名
```typescript
import { User } from '@/types'
import { userService } from '@/services'
import { Button } from '@/components'
```

### 环境变量
```env
VITE_APP_TITLE=移动端应用
VITE_API_BASE_URL=http://localhost:3000
VITE_PORT=5173
```

### API代理
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## 📚 API文档

### 类型系统
- 完整的TypeScript类型定义
- API接口类型
- 组件Props类型
- 工具函数类型

### 使用示例
```typescript
import type { User, ApiResponse, ButtonProps } from '@/types'

// API调用
const user: User = await userService.getUserInfo()

// 组件定义
const MyButton: React.FC<ButtonProps> = ({ variant, children }) => {
  return <button className={cn('btn', `btn-${variant}`)}>{children}</button>
}
```

## 🚀 部署

### 构建产物
```bash
yarn build
```

生成文件：
- `dist/index.html` - 入口文件
- `dist/assets/*.js` - JavaScript文件
- `dist/assets/*.css` - CSS文件
- `dist/assets/*.gz` - Gzip压缩文件
- `dist/assets/*.br` - Brotli压缩文件

### 服务器配置
详见 [部署配置指南](docs/deployment.md)

## 📊 性能指标

### 构建大小
| 文件类型 | 原始大小 | Gzip | Brotli |
|---------|---------|------|--------|
| CSS | 152.71 KB | 19.94 KB | 16.64 KB |
| JavaScript | 325.82 KB | 111.12 KB | 97.15 KB |
| **总计** | **478.53 KB** | **131.06 KB** | **113.79 KB** |

### 优化特性
- ✅ 代码分包 (vendor, antd, router, redux)
- ✅ Terser压缩 (删除console.log)
- ✅ CSS压缩优化
- ✅ 预压缩文件生成
- ✅ 缓存策略配置

## 🛠️ 开发指南

### 添加新页面
1. 在 `src/pages/` 创建页面组件
2. 使用 `BasicLayout` 布局组件
3. 添加路由配置

### 添加新组件
1. 在 `src/components/` 创建组件目录
2. 定义TypeScript类型
3. 使用Tailwind CSS样式
4. 导出组件

### 状态管理
1. 在 `src/store/slices/` 创建切片
2. 配置到store中
3. 使用 `useAppSelector` 和 `useAppDispatch`

## �� 许可证

MIT License
