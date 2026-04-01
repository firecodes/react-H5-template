# Cursor 规则说明

本目录包含了 H5 Template React 项目的完整 Cursor 规则集，帮助 AI 更好地理解项目结构、代码规范和开发流程。

## 📁 规则文件列表

### 全局规则（alwaysApply: true）

这些规则会在每次请求时都应用：

1. **project-overview.mdc** - 项目概览
   - 技术栈说明
   - 目录结构
   - 开发工具链
   - 关键约定

2. **code-standards.mdc** - 代码规范
   - 命名规范（文件、变量、函数、组件）
   - 导入顺序
   - TypeScript 使用规范
   - 注释规范

### 特定范围规则（globs）

这些规则只在特定文件或目录中应用：

3. **react-development.mdc** - React 开发规范
   - 应用范围：`src/**/*.{tsx,jsx}`
   - 组件开发标准
   - Hooks 使用规范
   - Props 设计
   - 性能优化原则

4. **api-development.mdc** - API 开发规范
   - 应用范围：`src/services/**/*`
   - Services 目录结构
   - 类型命名规范（模块前缀）
   - API 方法定义
   - 类型导出

5. **page-development.mdc** - 页面开发规范
   - 应用范围：`src/pages/**/*`
   - 页面目录命名（小驼峰）
   - 必需文件结构
   - BEM 样式命名规范
   - 路由配置

6. **style-guidelines.mdc** - 样式规范
   - 应用范围：`**/*.{less,css}`
   - BEM 命名详解（Block, Element `_`, Modifier `__`）
   - Less 使用规范
   - CSS Modules
   - 移动端适配

7. **state-management.mdc** - 状态管理规范
   - 应用范围：`src/store/**/*`
   - Zustand 使用指南
   - Store 创建规范
   - 选择器 Hooks
   - 持久化配置

8. **utils-guidelines.mdc** - 工具函数规范
   - 应用范围：`src/utils/**/*`
   - 工具函数设计原则
   - 请求封装使用
   - 存储工具使用
   - 格式化工具使用

## 🎯 规则优先级

1. **全局规则**（alwaysApply: true）始终生效
2. **特定范围规则**（globs）根据当前文件路径匹配
3. 当多个规则都匹配时，AI 会综合考虑所有相关规则

## 📝 使用建议

### 开发新功能时

1. 先查看 `project-overview.mdc` 了解项目整体结构
2. 根据开发内容查看对应的规则文件：
   - 开发 API → `api-development.mdc`
   - 开发页面 → `page-development.mdc` + `react-development.mdc`
   - 编写样式 → `style-guidelines.mdc`
   - 状态管理 → `state-management.mdc`
   - 工具函数 → `utils-guidelines.mdc`

### 代码审查时

参考 `code-standards.mdc` 和具体的规则文件进行检查。

### 遇到问题时

1. 查看对应规则文件的"常见错误"部分
2. 查看项目 `docs/` 目录下的详细文档

## 🔗 相关文档

项目完整文档位于 `docs/` 目录：

- [快速开始指南](../docs/QUICK_START.md)
- [项目结构指南](../docs/PROJECT_GUIDE.md)
- [React 开发规范](../docs/REACT_GUIDE.md)
- [API 开发规范](../docs/API_GUIDE.md)
- [页面开发规范](../docs/PAGE_GUIDE.md)
- [状态管理指南](../docs/ZUSTAND_GUIDE.md)
- [代码格式化配置](../docs/FORMAT_CONFIG.md)

## 💡 提示

这些规则文件使用 `.mdc` 扩展名（Markdown with Cursor extensions），支持：

- **Frontmatter 元数据**：控制规则应用范围
- **文件引用**：使用 `mdc:` 语法引用项目文件
- **Markdown 格式**：支持完整的 Markdown 语法

规则文件会帮助 Cursor AI 更好地理解您的项目，提供更准确的代码建议和补全。
