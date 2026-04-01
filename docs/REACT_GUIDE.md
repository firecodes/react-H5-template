# React 开发规范

本文档规定了 React 组件开发规范、代码风格和最佳实践。

## 📋 目录

- [组件开发规范](#组件开发规范)
- [代码风格规范](#代码风格规范)
- [TypeScript 规范](#typescript-规范)
- [Hooks 使用规范](#hooks-使用规范)
- [性能优化规范](#性能优化规范)
- [测试规范](#测试规范)

## 组件开发规范

### 1. 组件分类

#### 1.1 通用组件 (Common Components)

存放位置：`src/components/Common/`

**特点**：

- 纯 UI 组件，无业务逻辑
- 高度可复用
- 完善的 Props 类型定义
- 提供默认值

**示例**：

```typescript
// src/components/Common/Button/index.tsx
import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

interface ButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger'
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 按钮内容 */
  children: ReactNode
  /** 点击事件 */
  onClick?: () => void
}

const Button: FC<ButtonProps> = ({
  type = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const handleClick = () => {
    if (disabled || loading) return
    onClick?.()
  }

  return (
    <button
      className={classNames(
        styles.button,
        styles[`button__${type}`],
        styles[`button__${size}`],
        {
          [styles.button__disabled]: disabled,
          [styles.button__loading]: loading,
        }
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading && <span className={styles.button_loadingIcon}>⏳</span>}
      {children}
    </button>
  )
}

export default Button
```

#### 1.2 业务组件 (Business Components)

存放位置：`src/components/Business/`

**特点**：

- 包含业务逻辑
- 可能调用 API
- 可能使用全局状态
- 在多个页面复用

**示例**：

```typescript
// src/components/Business/UserCard/index.tsx
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar } from 'antd-mobile'
import { useUserStore } from '@/store'
import styles from './index.module.less'

interface UserCardProps {
  /** 用户ID */
  userId: number
  /** 是否显示操作按钮 */
  showActions?: boolean
}

const UserCard: FC<UserCardProps> = ({ userId, showActions = true }) => {
  const navigate = useNavigate()
  const { userInfo } = useUserStore()

  const handleViewProfile = () => {
    navigate(`/user/${userId}`)
  }

  return (
    <Card className={styles.userCard}>
      <div className={styles.userCard_header}>
        <Avatar src={userInfo?.avatar} className={styles.userCard_avatar} />
        <div className={styles.userCard_info}>
          <h3 className={styles.userCard_name}>{userInfo?.username}</h3>
          <p className={styles.userCard_email}>{userInfo?.email}</p>
        </div>
      </div>
      {showActions && (
        <div className={styles.userCard_actions}>
          <button onClick={handleViewProfile}>查看详情</button>
        </div>
      )}
    </Card>
  )
}

export default UserCard
```

#### 1.3 页面组件 (Page Components)

存放位置：`src/pages/{pageName}/`

**特点**：

- 对应路由
- 组织页面结构
- 协调子组件
- 处理页面级状态

**示例**：

```typescript
// src/pages/userProfile/index.tsx
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from '@/hooks'
import { UserAPI } from '@/services'
import { Loading } from '@/components/Common'
import UserInfo from './components/UserInfo'
import UserPosts from './components/UserPosts'
import styles from './index.module.less'

const UserProfile: FC = () => {
  const { userId } = useParams<{ userId: string }>()

  const { data: userInfo, loading, run } = useRequest(
    () => UserAPI.getUserInfo(Number(userId)),
    { manual: true }
  )

  useEffect(() => {
    if (userId) {
      run()
    }
  }, [userId, run])

  if (loading) return <Loading />

  return (
    <div className={styles.userProfilePage}>
      <UserInfo userInfo={userInfo} />
      <UserPosts userId={Number(userId)} />
    </div>
  )
}

export default UserProfile
```

### 2. 组件文件结构

#### 2.1 标准组件结构

```
ComponentName/
├── index.tsx              # 组件主文件
├── index.module.less      # 组件样式
├── types.ts              # 类型定义（可选）
├── constants.ts          # 组件常量（可选）
└── components/           # 子组件（可选）
    └── SubComponent/
        ├── index.tsx
        └── index.module.less
```

#### 2.2 组件代码结构

```typescript
// 1. 导入第三方库
import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Toast } from 'antd-mobile'

// 2. 导入项目内部模块
import { useRequest } from '@/hooks'
import { UserAPI } from '@/services'
import { useUserStore } from '@/store'

// 3. 导入类型定义
import type { User } from '@/services'

// 4. 导入样式
import styles from './index.module.less'

// 5. 定义类型
interface ComponentProps {
  // props 定义
}

// 6. 定义常量
const DEFAULT_PAGE_SIZE = 10

// 7. 组件定义
const Component: FC<ComponentProps> = (props) => {
  // 7.1 Hooks
  const navigate = useNavigate()
  const { userInfo } = useUserStore()

  // 7.2 State
  const [loading, setLoading] = useState(false)

  // 7.3 Computed values (useMemo)
  const computedValue = useMemo(() => {
    // 计算逻辑
  }, [])

  // 7.4 Methods (useCallback)
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, [])

  // 7.5 Effects
  useEffect(() => {
    // 副作用逻辑
  }, [])

  // 7.6 Render
  return (
    <div className={styles.component}>
      {/* JSX */}
    </div>
  )
}

// 8. 导出
export default Component
```

### 3. 组件命名规范

#### 3.1 组件文件命名

- ✅ **组件目录**: PascalCase (如 `UserCard/`, `ProductList/`)
- ✅ **组件文件**: `index.tsx` (统一使用 index)
- ✅ **样式文件**: `index.module.less`
- ✅ **类型文件**: `types.ts`

#### 3.2 组件命名

```typescript
// ✅ 正确：使用 PascalCase
const UserCard: FC = () => {}
const ProductList: FC = () => {}
const OrderDetailModal: FC = () => {}

// ❌ 错误：使用 camelCase
const userCard: FC = () => {}
const productList: FC = () => {}
```

#### 3.3 Props 命名

```typescript
// ✅ 正确：清晰的命名
interface UserCardProps {
  userId: number
  showAvatar?: boolean
  onUserClick?: (userId: number) => void
}

// ❌ 错误：模糊的命名
interface UserCardProps {
  id: number // 不明确
  show?: boolean // 显示什么？
  onClick?: () => void // 点击什么？
}
```

### 4. Props 设计规范

#### 4.1 Props 类型定义

```typescript
// ✅ 正确：完整的类型定义
interface ButtonProps {
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger'
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 按钮内容 */
  children: ReactNode
  /** 点击事件 */
  onClick?: () => void
}

// ❌ 错误：使用 any
interface ButtonProps {
  type?: any
  onClick?: any
}
```

#### 4.2 Props 默认值

```typescript
// ✅ 正确：使用解构赋值设置默认值
const Button: FC<ButtonProps> = ({
  type = 'default',
  size = 'medium',
  disabled = false,
  children,
  onClick,
}) => {
  // ...
}

// ✅ 也可以：使用 defaultProps（类组件风格）
Button.defaultProps = {
  type: 'default',
  size: 'medium',
  disabled: false,
}
```

#### 4.3 Props 验证

```typescript
// ✅ 正确：使用 TypeScript 类型系统
interface UserListProps {
  users: User[] // 必需
  pageSize?: number // 可选
  onUserSelect: (user: User) => void // 必需的回调
}

// ❌ 错误：所有 props 都设为可选
interface UserListProps {
  users?: User[]
  pageSize?: number
  onUserSelect?: (user: User) => void
}
```

## 代码风格规范

### 1. 命名规范

#### 1.1 变量命名

```typescript
// ✅ 正确：使用 camelCase
const userName = 'John'
const isLoading = false
const hasPermission = true
const itemCount = 10

// ❌ 错误
const UserName = 'John' // 不要用 PascalCase
const is_loading = false // 不要用 snake_case
const ITEM_COUNT = 10 // 常量才用大写
```

#### 1.2 常量命名

```typescript
// ✅ 正确：使用 UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3
const DEFAULT_PAGE_SIZE = 10

// 枚举
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}
```

#### 1.3 函数命名

```typescript
// ✅ 正确：使用动词开头的 camelCase
const getUserInfo = () => {}
const handleClick = () => {}
const fetchDataList = () => {}
const validateForm = () => {}
const isValidEmail = () => {}
const hasPermission = () => {}

// ❌ 错误
const user = () => {} // 不清晰
const click = () => {} // 缺少 handle 前缀
const data = () => {} // 不是动词
```

#### 1.4 事件处理函数命名

```typescript
// ✅ 正确：使用 handle 前缀
const handleClick = () => {}
const handleSubmit = () => {}
const handleChange = () => {}
const handleUserSelect = (user: User) => {}

// Props 中的回调使用 on 前缀
interface ComponentProps {
  onClick?: () => void
  onSubmit?: (data: FormData) => void
  onChange?: (value: string) => void
  onUserSelect?: (user: User) => void
}
```

### 2. 代码格式规范

#### 2.1 缩进和空格

```typescript
// ✅ 正确：使用 2 空格缩进
const Component: FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

#### 2.2 引号使用

```typescript
// ✅ 正确：统一使用单引号
import { Button } from 'antd-mobile'
const name = 'John'
const className = 'button-primary'

// JSX 属性使用双引号
<Button className="primary">Click</Button>
```

#### 2.3 分号使用

```typescript
// ✅ 推荐：不使用分号（配合 ESLint）
const name = 'John'
const age = 25

// ✅ 也可以：使用分号（保持一致）
const name = 'John'
const age = 25
```

#### 2.4 对象和数组

```typescript
// ✅ 正确：多行时每项独占一行
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
}

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]

// ✅ 单行时紧凑写法
const point = { x: 10, y: 20 }
const colors = ['red', 'green', 'blue']
```

### 3. JSX 编写规范

#### 3.1 组件属性

```typescript
// ✅ 正确：多个属性时换行
<Button
  type="primary"
  size="large"
  disabled={isLoading}
  onClick={handleClick}
>
  Submit
</Button>

// ✅ 单个属性时可以单行
<Button type="primary">Submit</Button>

// ❌ 错误：多个属性挤在一行
<Button type="primary" size="large" disabled={isLoading} onClick={handleClick}>Submit</Button>
```

#### 3.2 条件渲染

```typescript
// ✅ 正确：使用三元运算符
{isLoading ? <Loading /> : <Content />}

// ✅ 正确：使用 && 运算符
{isError && <ErrorMessage />}
{userInfo && <UserCard user={userInfo} />}

// ✅ 正确：复杂条件提取为变量
const renderContent = () => {
  if (isLoading) return <Loading />
  if (isError) return <ErrorMessage />
  return <Content />
}

return <div>{renderContent()}</div>

// ❌ 错误：在 JSX 中写复杂逻辑
{isLoading ? <Loading /> : isError ? <ErrorMessage /> : hasData ? <Content /> : <Empty />}
```

#### 3.3 列表渲染

```typescript
// ✅ 正确：使用 map 渲染列表
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

// ✅ 正确：复杂项提取为组件
{users.map((user) => (
  <UserListItem key={user.id} user={user} />
))}

// ❌ 错误：使用 index 作为 key
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}
```

#### 3.4 事件处理

```typescript
// ✅ 正确：不需要参数时直接传递函数
<Button onClick={handleClick}>Click</Button>

// ✅ 正确：需要参数时使用箭头函数
<Button onClick={() => handleDelete(user.id)}>Delete</Button>

// ✅ 更好：使用 useCallback 优化
const handleDelete = useCallback((id: number) => {
  // 删除逻辑
}, [])

<Button onClick={() => handleDelete(user.id)}>Delete</Button>

// ❌ 错误：直接调用函数
<Button onClick={handleClick()}>Click</Button>
```

### 4. 注释规范

#### 4.1 组件注释

````typescript
/**
 * 用户卡片组件
 *
 * @description 展示用户基本信息，支持头像、姓名、邮箱等
 * @example
 * ```tsx
 * <UserCard userId={1} showActions />
 * ```
 */
const UserCard: FC<UserCardProps> = props => {
  // ...
}
````

#### 4.2 函数注释

````typescript
/**
 * 格式化手机号
 *
 * @param phone - 原始手机号
 * @returns 格式化后的手机号 (138****8000)
 * @example
 * ```ts
 * formatPhone('13800138000') // => '138****8000'
 * ```
 */
const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
````

#### 4.3 行内注释

```typescript
// ✅ 正确：解释为什么这样做
// 使用 setTimeout 确保在 DOM 更新后执行
setTimeout(() => {
  scrollToBottom()
}, 0)

// ❌ 错误：注释说明代码在做什么（代码本身已经很清楚）
// 设置 count 为 0
setCount(0)
```

## TypeScript 规范

### 1. 类型定义

#### 1.1 接口 vs 类型别名

```typescript
// ✅ 推荐：对象类型使用 interface
interface User {
  id: number
  name: string
  email: string
}

// ✅ 推荐：联合类型、交叉类型使用 type
type Status = 'pending' | 'success' | 'error'
type UserWithRole = User & { role: string }

// ✅ 推荐：函数类型使用 type
type EventHandler = (event: Event) => void
```

#### 1.2 避免使用 any

```typescript
// ❌ 错误：使用 any
const handleData = (data: any) => {
  // ...
}

// ✅ 正确：使用具体类型
const handleData = (data: User) => {
  // ...
}

// ✅ 正确：使用泛型
const handleData = <T>(data: T) => {
  // ...
}

// ✅ 正确：使用 unknown（需要类型检查）
const handleData = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    // 类型收窄后使用
  }
}
```

#### 1.3 可选属性和必需属性

```typescript
// ✅ 正确：明确区分可选和必需
interface UserFormData {
  username: string // 必需
  email: string // 必需
  phone?: string // 可选
  avatar?: string // 可选
}

// ✅ 正确：使用 Partial 和 Required
type PartialUser = Partial<User> // 所有属性可选
type RequiredUser = Required<User> // 所有属性必需
```

### 2. 类型导入

```typescript
// ✅ 正确：使用 type 导入类型
import type { User, UserListParams } from '@/services'
import type { FC, ReactNode } from 'react'

// ✅ 正确：混合导入
import { UserAPI, type User } from '@/services'
```

### 3. 泛型使用

```typescript
// ✅ 正确：使用泛型提高复用性
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

const fetchUser = (): Promise<ApiResponse<User>> => {
  return http.get('/user')
}

// ✅ 正确：组件泛型
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

const List = <T,>({ items, renderItem }: ListProps<T>) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  )
}
```

## Hooks 使用规范

### 1. Hooks 调用顺序

```typescript
// ✅ 正确：Hooks 在组件顶层调用
const Component: FC = () => {
  const navigate = useNavigate()
  const { userInfo } = useUserStore()
  const [count, setCount] = useState(0)

  // ...
}

// ❌ 错误：在条件语句中调用 Hooks
const Component: FC = () => {
  if (condition) {
    const [count, setCount] = useState(0) // 错误！
  }
}
```

### 2. useState 使用

```typescript
// ✅ 正确：明确的状态命名
const [isLoading, setIsLoading] = useState(false)
const [userList, setUserList] = useState<User[]>([])
const [formData, setFormData] = useState<FormData>({
  username: '',
  email: '',
})

// ✅ 正确：使用函数式更新
setCount(prevCount => prevCount + 1)
setUserList(prevList => [...prevList, newUser])

// ❌ 错误：直接修改状态
userList.push(newUser) // 错误！
setUserList(userList) // 不会触发更新
```

### 3. useEffect 使用

```typescript
// ✅ 正确：明确依赖项
useEffect(() => {
  fetchData(userId)
}, [userId])

// ✅ 正确：清理副作用
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000)

  return () => {
    clearInterval(timer)
  }
}, [])

// ❌ 错误：缺少依赖项
useEffect(() => {
  fetchData(userId) // userId 应该在依赖项中
}, [])

// ❌ 错误：依赖项过多导致频繁执行
useEffect(() => {
  // ...
}, [obj]) // 对象引用每次都变化
```

### 4. useCallback 和 useMemo

```typescript
// ✅ 正确：缓存函数
const handleClick = useCallback(() => {
  console.log(count)
}, [count])

// ✅ 正确：缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// ❌ 错误：过度使用
const handleClick = useCallback(() => {
  console.log('clicked') // 简单函数不需要缓存
}, [])

// ❌ 错误：缺少依赖
const handleClick = useCallback(() => {
  console.log(count) // count 应该在依赖项中
}, [])
```

### 5. 自定义 Hooks

```typescript
// ✅ 正确：自定义 Hook 命名以 use 开头
const useUserInfo = (userId: number) => {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const data = await UserAPI.getUserInfo(userId)
        setUserInfo(data)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { userInfo, loading }
}

// 使用
const Component: FC = () => {
  const { userInfo, loading } = useUserInfo(1)
  // ...
}
```

## 性能优化规范

### 1. 避免不必要的渲染

```typescript
// ✅ 正确：使用 React.memo
const UserCard = React.memo<UserCardProps>(({ user }) => {
  return <div>{user.name}</div>
})

// ✅ 正确：使用 useMemo 缓存计算结果
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name))
}, [users])

// ✅ 正确：使用 useCallback 缓存函数
const handleUserClick = useCallback((userId: number) => {
  navigate(`/user/${userId}`)
}, [navigate])
```

### 2. 列表优化

```typescript
// ✅ 正确：使用稳定的 key
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

// ✅ 正确：虚拟列表（大量数据时）
import { List } from 'react-virtualized'

<List
  width={300}
  height={600}
  rowCount={users.length}
  rowHeight={50}
  rowRenderer={({ index, key, style }) => (
    <div key={key} style={style}>
      <UserCard user={users[index]} />
    </div>
  )}
/>
```

### 3. 懒加载

```typescript
// ✅ 正确：路由懒加载
import { lazy, Suspense } from 'react'

const UserProfile = lazy(() => import('@/pages/userProfile'))

<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>

// ✅ 正确：组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

## 最佳实践总结

### ✅ 推荐做法

1. **组件单一职责**：每个组件只做一件事
2. **Props 类型完整**：所有 Props 都有明确的类型定义
3. **使用 TypeScript**：充分利用类型系统
4. **合理使用 Hooks**：遵循 Hooks 规则
5. **性能优化**：在需要时使用 memo、useMemo、useCallback
6. **代码复用**：提取公共逻辑到自定义 Hooks
7. **错误处理**：使用 Error Boundary 捕获错误
8. **代码分割**：使用懒加载优化首屏加载
9. **代码审查**：团队代码审查保证质量

### ❌ 避免做法

1. **避免使用 any**：失去类型安全
2. **避免在 JSX 中写复杂逻辑**：影响可读性
3. **避免直接修改 state**：破坏不可变性
4. **避免过度优化**：不要过早优化
5. **避免深层嵌套**：组件嵌套不超过 3 层
6. **避免使用 index 作为 key**：可能导致性能问题
7. **避免在循环中定义组件**：每次渲染都会创建新组件
8. **避免滥用 Context**：只用于真正全局的状态
9. **避免在 useEffect 中缺少依赖**：可能导致 bug
10. **避免忽略 ESLint 警告**：警告通常有意义

## 工具配置

### ESLint 配置

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'react/prop-types': 'off', // 使用 TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]
```

### Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

## 参考资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)

## 相关文档

- [项目结构指南](./PROJECT_GUIDE.md)
- [页面开发规范](./PAGE_GUIDE.md)
- [API 开发规范](./API_GUIDE.md)
