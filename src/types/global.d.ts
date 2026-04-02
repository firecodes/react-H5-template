// 全局类型声明

declare global {
  // 扩展Window对象
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: unknown
    __REDUX_DEVTOOLS_EXTENSION__?: unknown
  }
}

// 通用工具类型
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

// ID类型
export type ID = string | number

// 响应式断点类型
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// 主题类型
export type Theme = 'light' | 'dark' | 'auto'

// 尺寸类型
export type Size = 'small' | 'medium' | 'large'

// 状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 颜色变体类型
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'

// 按钮变体类型
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'

// 输入框类型
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'

// 事件处理器类型
export type EventHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void
export type SubmitHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void

// 组件Props基础类型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  testId?: string
}

// 可点击组件Props
export interface ClickableProps extends BaseComponentProps {
  onClick?: EventHandler
  disabled?: boolean
}

// 表单控件Props
export interface FormControlProps extends BaseComponentProps {
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
}

export {} 