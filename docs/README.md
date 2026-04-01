# 项目文档索引

本目录包含项目的所有开发规范文档。

## 📚 核心文档

### 快速开始

- **[QUICK_START.md](./QUICK_START.md)** - 5分钟快速上手指南
  - 项目启动
  - 创建页面
  - 调用 API
  - 使用 Hooks

### 项目结构

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - 项目结构完整指南
  - 目录结构说明
  - 各目录职责
  - 命名规范
  - 已完成功能模块

## 📖 开发规范

### React 开发

- **[REACT_GUIDE.md](./REACT_GUIDE.md)** - React 开发规范
  - 组件开发规范
  - 代码风格规范
  - TypeScript 规范
  - Hooks 使用规范
  - 性能优化规范
  - 测试规范

### API 开发

- **[API_GUIDE.md](./API_GUIDE.md)** - Services 模块开发规范
  - 目录结构规范
  - 类型命名规范
  - 创建新模块步骤
  - 类型检测机制
  - 最佳实践

### 页面开发

- **[PAGE_GUIDE.md](./PAGE_GUIDE.md)** - 页面开发规范
  - 页面目录命名规范（小驼峰）
  - BEM 样式命名规范
  - 页面结构要求
  - 组件放置原则
  - 最佳实践

### 状态管理

- **[ZUSTAND_GUIDE.md](./ZUSTAND_GUIDE.md)** - Zustand 状态管理指南
  - Zustand 简介和优势
  - 已实现的 Store
  - 使用示例（基础和高级）
  - 创建新 Store 步骤
  - 中间件使用
  - 与系统集成

### Git 提交规范

- **[GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)** - Git Commit 规范和工具使用（完整指南）
  - 快速开始
  - Conventional Commits 规范
  - 提交类型说明
  - 提交流程（Commitizen）
  - 工具说明（husky、lint-staged、commitlint）
  - 自动生成 CHANGELOG
  - 常见问题解决
  - 配置说明
- **[GIT_SETUP.md](./GIT_SETUP.md)** - Git 配置技术细节
  - 依赖包说明
  - 配置文件详解
  - 工作流程图
  - 故障排查指南

## 🎯 按场景查找

### 我要开发新功能

1. [QUICK_START.md](./QUICK_START.md) - 快速开始
2. [REACT_GUIDE.md](./REACT_GUIDE.md) - React 组件开发
3. [API_GUIDE.md](./API_GUIDE.md) - 如何创建 API 模块
4. [PAGE_GUIDE.md](./PAGE_GUIDE.md) - 如何创建页面
5. [ZUSTAND_GUIDE.md](./ZUSTAND_GUIDE.md) - 如何使用状态管理

### 我要了解项目结构

1. [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - 完整项目结构说明
2. [QUICK_START.md](./QUICK_START.md) - 快速了解目录

### 我要规范代码

1. [REACT_GUIDE.md](./REACT_GUIDE.md) - React 开发规范
2. [API_GUIDE.md](./API_GUIDE.md) - API 模块规范
3. [PAGE_GUIDE.md](./PAGE_GUIDE.md) - 页面和样式规范
4. [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md) - Git 提交规范
5. [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - 整体命名规范

## 🔧 工具

### 类型检测脚本

```bash
npm run check:types
```

检测 API 类型重复和命名规范，详见 [API_GUIDE.md](./API_GUIDE.md)

### Git 提交工具

```bash
# 交互式提交
npm run commit

# 生成 CHANGELOG
npm run changelog
```

详见 [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)

## 📝 文档维护

### 文档结构

```
docs/
├── README.md              # 本文件 - 文档索引
├── QUICK_START.md         # 快速开始指南
├── PROJECT_GUIDE.md       # 项目结构指南
├── REACT_GUIDE.md         # React 开发规范
├── API_GUIDE.md           # API 开发规范
├── PAGE_GUIDE.md          # 页面开发规范
├── ZUSTAND_GUIDE.md       # 状态管理指南
├── GIT_COMMIT_GUIDE.md    # Git 提交规范
├── FORMAT_CONFIG.md       # 代码格式化配置
└── CHANGELOG.md           # 文档变更记录
```

### 更新原则

- 所有项目相关的规范文档都应放在 `docs/` 目录下
- 更新文档时请同步更新本索引文件
- 保持文档的简洁性和可读性
- 避免重复内容

## 🌟 文档特点

- ✅ **结构清晰**: 按功能模块组织，易于查找
- ✅ **内容完整**: 涵盖项目开发的所有规范
- ✅ **示例丰富**: 提供大量代码示例
- ✅ **易于维护**: 避免重复，统一规范

## 📚 外部资源

- [React 官方文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [antd-mobile 文档](https://mobile.ant.design/)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
- [ahooks 文档](https://ahooks.js.org/)
