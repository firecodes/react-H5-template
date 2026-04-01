# 页面开发规范

本文档规定了页面目录结构和样式编写规范。

## 📁 页面目录结构

### 目录命名规则

页面目录采用**小驼峰命名**（camelCase）：

```
src/pages/
├── home/                    # 首页
│   ├── index.tsx           # 页面组件
│   ├── index.module.less   # 页面样式
│   └── components/         # 页面私有组件
├── login/                   # 登录页
│   ├── index.tsx
│   ├── index.module.less
│   └── components/
├── user/                    # 用户中心
│   ├── index.tsx
│   ├── index.module.less
│   └── components/
└── productDetail/           # 产品详情（多单词用小驼峰）
    ├── index.tsx
    ├── index.module.less
    └── components/
```

### 命名规范

- ✅ 使用小驼峰命名（camelCase）
- ✅ 单个单词：`home`, `login`, `about`, `user`
- ✅ 多个单词：`productDetail`, `orderList`, `userProfile`
- ❌ 禁止使用 PascalCase：`Home`, `Login`, `ProductDetail`
- ❌ 禁止使用 kebab-case：`product-detail`, `order-list`

### 必需文件

每个页面目录必须包含：

- `index.tsx` - 页面组件（必需）
- `index.module.less` - 页面样式（必需）
- `components/` - 页面私有组件目录（必需）

### 二级页面结构

如果页面需要分模块，采用二级目录结构：

```
src/pages/
└── user/
    ├── index.tsx              # 用户中心主页
    ├── index.module.less
    ├── components/            # 用户中心公共组件
    ├── profile/               # 个人资料子页面
    │   ├── index.tsx
    │   ├── index.module.less
    │   └── components/
    └── settings/              # 设置子页面
        ├── index.tsx
        ├── index.module.less
        └── components/
```

## 🎨 样式编写规范 - BEM 命名

### BEM 命名结构

```
Block_Element__Modifier
```

### 组成部分

1. **Block (块)**: 独立的组件，如 `loginPage`, `homePage`
2. **Element (元素)**: 块的组成部分，使用 **单下划线 `_`** 连接
3. **Modifier (修饰符)**: 块或元素的变体，使用 **双下划线 `__`** 连接

### 命名规则

- **Block**: 第一个单词小写，后续单词首字母大写
  - ✅ `loginPage`, `userCard`, `productList`
  - ❌ `LoginPage` (PascalCase)
  - ❌ `login-page` (kebab-case)

- **Element**: Block名称 + **单下划线 `_`** + 元素名称（小驼峰）
  - ✅ `loginPage_header`, `loginPage_submitButton`, `userCard_avatar`
  - ❌ `loginPage-header` (使用 `-`)
  - ❌ `loginPage__header` (使用 `__`)
  - ❌ `header` (缺少 Block 前缀)

- **Modifier**: Block/Element名称 + **双下划线 `__`** + 修饰符名称（小驼峰）
  - ✅ `loginPage__loading`, `loginPage_button__primary`, `userCard__disabled`
  - ❌ `loginPage-loading` (使用 `-`)
  - ❌ `loginPage--loading` (使用 `--`，已禁止)

### 命名对照表

| 类型               | 连接符          | 示例                        | 说明                    |
| ------------------ | --------------- | --------------------------- | ----------------------- |
| Block              | 无              | `loginPage`                 | 独立的组件或页面        |
| Element            | `_` (单下划线)  | `loginPage_header`          | Block 的组成部分        |
| Modifier           | `__` (双下划线) | `loginPage__loading`        | Block 或 Element 的变体 |
| Element + Modifier | `_` + `__`      | `loginPage_button__primary` | Element 的修饰符        |

## 💡 样式示例

### 示例 1: 登录页面

```less
// Block: loginPage
.loginPage {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// Element: loginPage_content (使用单下划线 _)
.loginPage_content {
  width: 100%;
  max-width: 400px;
  background: #fff;
}

// Element: loginPage_logoSection
.loginPage_logoSection {
  text-align: center;
  margin-bottom: 32px;
}

// Element: loginPage_logo
.loginPage_logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

// Element: loginPage_title
.loginPage_title {
  font-size: 24px;
  font-weight: 600;
}

// Element: loginPage_submitButton
.loginPage_submitButton {
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

// Modifier: loginPage_submitButton__loading (使用双下划线 __)
.loginPage_submitButton__loading {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 示例 2: 用户卡片

```less
// Block: userCard
.userCard {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

// Element: userCard_header
.userCard_header {
  display: flex;
  align-items: center;
}

// Element: userCard_avatar
.userCard_avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

// Element: userCard_title
.userCard_title {
  font-size: 18px;
  font-weight: 600;
}

// Modifier: userCard__compact
.userCard__compact {
  padding: 8px;
}

// Modifier: userCard__disabled
.userCard__disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

## 🔧 在 React 组件中使用

```tsx
import styles from './index.module.less'

const Login = () => {
  const [loading, setLoading] = useState(false)

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage_content}>
        <div className={styles.loginPage_logoSection}>
          <div className={styles.loginPage_logo}>👤</div>
          <h1 className={styles.loginPage_title}>欢迎登录</h1>
        </div>

        <form className={styles.loginPage_form}>
          <button
            className={`${styles.loginPage_submitButton} ${loading ? styles.loginPage_submitButton__loading : ''}`}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}
```

## ✅ 最佳实践

### 1. 组件放置原则

- **页面私有组件**：放在 `pages/xxx/components/` 下
- **全局公共组件**：放在 `src/components/` 下
- **业务组件**：如果多个页面使用，提升到 `src/components/`

### 2. 样式命名

- 页面根类名使用目录名 + Page 后缀（如 `homePage`, `loginPage`）
- 元素使用单下划线 `_`
- 修饰符使用双下划线 `__`

### 3. 嵌套规则

使用 LESS 的嵌套功能，但保持 BEM 命名结构：

```less
.loginPage {
  // Block 样式

  &_content {
    // Element 样式（使用单下划线 _）

    &__compact {
      // Modifier 样式（使用双下划线 __）
    }
  }

  &_header {
    // Element 样式
  }
}
```

### 4. 全局样式覆盖

当需要覆盖第三方组件（如 antd-mobile）的样式时，使用 `:global()`：

```less
.loginPage_form {
  :global(.adm-form-item-label) {
    font-size: 14px;
    font-weight: 500;
  }

  :global(.adm-input) {
    height: 48px;
    border-radius: 8px;
  }
}
```

### 5. 路由配置

```typescript
// src/router/routes.tsx
import Home from '@/pages/home'
import Login from '@/pages/login'
import ProductDetail from '@/pages/productDetail'

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
]
```

## 🚫 常见错误

### ❌ 错误示例

```less
// 错误 1: 使用 kebab-case
.login-page {
}

// 错误 2: Element 使用 `__` 而不是 `_`
.loginPage__header {
}

// 错误 3: Modifier 使用 `--` (已禁止)
.loginPage__button--primary {
}

// 错误 4: Element 缺少 Block 前缀
.header {
}

// 错误 5: 使用 PascalCase
.LoginPage {
}
```

### ✅ 正确示例

```less
// 正确 1: Block 使用小驼峰
.loginPage {
}

// 正确 2: Element 使用单下划线 `_`
.loginPage_header {
}

// 正确 3: Modifier 使用双下划线 `__`
.loginPage__loading {
}

// 正确 4: Element + Modifier 组合
.loginPage_button__primary {
}
```

## ✅ 创建新页面检查清单

- [ ] 目录名使用小驼峰命名
- [ ] 包含 `index.tsx` 文件
- [ ] 包含 `index.module.less` 文件
- [ ] 创建 `components/` 目录
- [ ] 样式遵循 BEM 命名规范
- [ ] 在路由配置中添加路由
- [ ] 组件名使用 PascalCase（如 `ProductDetail`）

## 🎯 快速记忆口诀

- **页面目录**: 小驼峰 camelCase
- **Block**: 独立存在，无连接符
- **Element**: 单下划线 `_`，是 Block 的一部分
- **Modifier**: 双下划线 `__`，表示变体或状态
- **禁止**: 不使用 `--`，统一使用 `__`

## 📚 相关文档

- [快速开始指南](./QUICK_START.md)
- [项目结构指南](./PROJECT_GUIDE.md)
