# Zustand 状态管理指南

## 📚 概述

本项目使用 [Zustand](https://github.com/pmndrs/zustand) 作为全局状态管理工具。Zustand 是一个轻量级、简单易用的状态管理库。

## 🎯 为什么选择 Zustand?

- ✅ **简单易用**: API 简洁,学习成本低
- ✅ **性能优秀**: 基于 React Hooks,支持细粒度订阅
- ✅ **TypeScript 友好**: 完整的类型支持
- ✅ **无样板代码**: 不需要 actions、reducers 等概念
- ✅ **中间件支持**: 支持 persist、devtools 等中间件
- ✅ **体积小**: 仅 1.2KB (gzipped)

## 📁 目录结构

```
src/store/
├── index.ts                    # Store 统一导出
└── modules/                    # Store 模块
    ├── userStore.ts           # 用户状态管理
    └── appStore.ts            # 应用全局状态
```

## 🔧 已实现的 Store

### 1. userStore - 用户状态管理

管理用户登录状态、用户信息等。

**状态**:

- `token`: 用户登录令牌
- `userInfo`: 用户信息对象
- `isLogin`: 是否已登录

**Actions**:

- `setToken(token)`: 设置 token
- `setUserInfo(userInfo)`: 设置用户信息
- `login(token, userInfo)`: 登录
- `logout()`: 登出
- `updateUserInfo(userInfo)`: 更新用户信息

**特性**:

- ✅ 数据持久化到 localStorage
- ✅ 自动同步登录状态
- ✅ 导出选择器 Hooks

### 2. appStore - 应用全局状态

管理应用级别的全局状态。

**状态**:

- `loading`: 全局加载状态
- `theme`: 主题模式 (light/dark)
- `locale`: 语言设置 (zh-CN/en-US)

**Actions**:

- `setLoading(loading)`: 设置加载状态
- `setTheme(theme)`: 设置主题
- `setLocale(locale)`: 设置语言
- `toggleTheme()`: 切换主题

## 💡 使用示例

### 基础用法

#### 1. 获取和修改状态

```typescript
import { useUserStore } from '@/store'

function MyComponent() {
  // 获取整个 store
  const { token, userInfo, login, logout } = useUserStore()

  // 登录
  const handleLogin = () => {
    login('token-123', {
      id: 1,
      username: 'user',
      email: 'user@example.com',
    })
  }

  // 登出
  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <p>Token: {token}</p>
      <p>用户名: {userInfo?.username}</p>
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  )
}
```

#### 2. 使用选择器 Hooks (性能优化)

```typescript
import { useIsLogin, useUserInfo } from '@/store'

function UserProfile() {
  // 只订阅 isLogin 状态,其他状态变化不会触发重新渲染
  const isLogin = useIsLogin()

  // 只订阅 userInfo 状态
  const userInfo = useUserInfo()

  if (!isLogin) {
    return <div>请先登录</div>
  }

  return <div>欢迎, {userInfo?.username}</div>
}
```

#### 3. 在非组件中使用

```typescript
import { useUserStore } from '@/store'

// 在 API 拦截器中获取 token
const token = useUserStore.getState().token

// 在非组件中调用 action
useUserStore.getState().logout()
```

### 高级用法

#### 1. 自定义选择器

```typescript
import { useUserStore } from '@/store'

function MyComponent() {
  // 自定义选择器,只订阅需要的数据
  const username = useUserStore((state) => state.userInfo?.username)

  return <div>{username}</div>
}
```

#### 2. 派生状态

```typescript
import { useUserStore } from '@/store'

function MyComponent() {
  // 计算派生状态
  const hasAvatar = useUserStore(
    (state) => !!state.userInfo?.avatar
  )

  return <div>{hasAvatar ? '有头像' : '无头像'}</div>
}
```

#### 3. 批量更新

```typescript
import { useUserStore } from '@/store'

function MyComponent() {
  const updateUser = useUserStore((state) => state.updateUserInfo)

  const handleUpdate = () => {
    // 批量更新多个字段
    updateUser({
      username: '新用户名',
      email: 'new@example.com',
    })
  }

  return <button onClick={handleUpdate}>更新用户</button>
}
```

## 🎨 最佳实践

### 1. 状态设计原则

✅ **推荐**: 将全局共享的状态放入 store

```typescript
// 用户信息、登录状态等全局数据
const { userInfo, isLogin } = useUserStore()
```

❌ **不推荐**: 将组件局部状态放入 store

```typescript
// 表单输入、弹窗显示等局部状态应该用 useState
const [formData, setFormData] = useState({})
```

### 2. 选择器使用

✅ **推荐**: 使用选择器 Hooks 进行细粒度订阅

```typescript
const isLogin = useIsLogin() // 只订阅 isLogin
```

❌ **不推荐**: 订阅整个 store

```typescript
const { isLogin } = useUserStore() // 任何状态变化都会重新渲染
```

### 3. Action 命名

✅ **推荐**: 使用语义化的 action 名称

```typescript
login(token, userInfo) // 清晰表达意图
logout()
updateUserInfo(data)
```

❌ **不推荐**: 使用通用的 set 方法

```typescript
setState({ ... })  // 不够语义化
```

### 4. 类型安全

✅ **推荐**: 定义完整的类型

```typescript
interface UserState {
  token: string | null
  userInfo: UserInfo | null
  isLogin: boolean
  login: (token: string, userInfo: UserInfo) => void
}
```

### 5. 持久化配置

只持久化需要的字段:

```typescript
persist(
  (set, get) => ({
    /* state and actions */
  }),
  {
    name: 'user-storage',
    partialize: state => ({
      token: state.token,
      userInfo: state.userInfo,
      // 不持久化 loading 等临时状态
    }),
  }
)
```

## 📝 创建新的 Store

### 步骤 1: 创建 Store 文件

在 `src/store/modules/` 下创建新文件,如 `cartStore.ts`:

```typescript
import { create } from 'zustand'

interface CartItem {
  id: number
  name: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(set => ({
  items: [],

  addItem: item => {
    set(state => ({
      items: [...state.items, item],
    }))
  },

  removeItem: id => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },
}))

// 导出选择器
export const useCartItems = () => useCartStore(state => state.items)
```

### 步骤 2: 导出 Store

在 `src/store/index.ts` 中导出:

```typescript
export * from './modules/cartStore'
```

### 步骤 3: 在组件中使用

```typescript
import { useCartStore, useCartItems } from '@/store'

function Cart() {
  const items = useCartItems()
  const { addItem, removeItem } = useCartStore()

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}
```

## 🔌 中间件

### 1. Persist - 持久化

```typescript
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      /* state */
    }),
    {
      name: 'user-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### 2. DevTools - 开发工具

```typescript
import { devtools } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      /* state */
    }),
    { name: 'UserStore' }
  )
)
```

### 3. 组合多个中间件

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        /* state */
      }),
      { name: 'user-storage' }
    ),
    { name: 'UserStore' }
  )
)
```

## 🔄 与系统集成

### 1. 路由守卫集成

```typescript
// src/router/AuthGuard.tsx
import { useIsLogin } from '@/store'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useIsLogin()

  if (!isLogin) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
```

### 2. API 拦截器集成

```typescript
// src/utils/request.ts
import { useUserStore } from '@/store'

// 请求拦截器
http.interceptors.request.use(config => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout()
      Toast.show('登录已过期，请重新登录')
    }
    return Promise.reject(error)
  }
)
```

## 🐛 常见问题

### Q: 如何在组件外使用 store?

A: 使用 `getState()` 方法:

```typescript
const token = useUserStore.getState().token
useUserStore.getState().logout()
```

### Q: 如何订阅多个 store?

A: 直接使用多个 hooks:

```typescript
const { userInfo } = useUserStore()
const { theme } = useAppStore()
```

### Q: 状态更新后组件不重新渲染?

A: 检查是否使用了正确的选择器:

```typescript
// ❌ 可能不会触发更新
const user = useUserStore(state => state.userInfo)

// ✅ 正确的用法
const { userInfo } = useUserStore()
```

### Q: 如何重置 store 到初始状态?

A: 创建一个 reset action:

```typescript
export const useUserStore = create<UserState>()(set => ({
  // ... states
  reset: () => {
    set({
      token: null,
      userInfo: null,
      isLogin: false,
    })
  },
}))
```

## 📊 与其他状态管理库对比

### Zustand vs Redux

| 特性       | Zustand  | Redux        |
| ---------- | -------- | ------------ |
| 包大小     | 1.2KB    | ~15KB        |
| 样板代码   | 极少     | 较多         |
| 学习曲线   | 低       | 高           |
| TypeScript | 原生支持 | 需要额外配置 |
| DevTools   | 支持     | 支持         |
| 中间件     | 简单     | 复杂         |

### Zustand vs Context API

| 特性       | Zustand    | Context      |
| ---------- | ---------- | ------------ |
| 性能       | 优秀       | 一般         |
| 重渲染     | 细粒度控制 | 容易过度渲染 |
| 使用复杂度 | 简单       | 中等         |
| 持久化     | 内置中间件 | 需自行实现   |

## 📚 参考资料

- [Zustand 官方文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand 中间件](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

## 🔗 相关文档

- [快速开始指南](./QUICK_START.md)
- [项目结构指南](./PROJECT_GUIDE.md)
