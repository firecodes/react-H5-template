// 组件相关类型定义

import type { 
  BaseComponentProps, 
  ClickableProps, 
  FormControlProps,
  ButtonVariant,
  Size,
  ColorVariant,
  InputType,
  EventHandler,
  ChangeHandler 
} from '@/types/global'

// 按钮组件Props
export interface ButtonProps extends ClickableProps {
  variant?: ButtonVariant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

// 输入框组件Props
export interface InputProps extends FormControlProps {
  type?: InputType
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onChange?: ChangeHandler
  onFocus?: EventHandler<HTMLInputElement>
  onBlur?: EventHandler<HTMLInputElement>
}

// 卡片组件Props
export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
  clickable?: boolean
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: Size
}

// 模态框组件Props
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  closable?: boolean
  maskClosable?: boolean
  width?: string | number
  height?: string | number
  centered?: boolean
  destroyOnClose?: boolean
}

// 加载组件Props
export interface LoadingProps extends BaseComponentProps {
  loading?: boolean
  text?: string
  size?: Size
  color?: ColorVariant
  overlay?: boolean
}

// 通知组件Props
export interface NotificationProps {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  closable?: boolean
  onClose?: () => void
}

// 导航栏组件Props
export interface NavBarProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  onBack?: () => void
  showBack?: boolean
  fixed?: boolean
  transparent?: boolean
}

// 标签页组件Props
export interface TabsProps extends BaseComponentProps {
  activeKey: string
  onChange: (key: string) => void
  items: TabItem[]
  type?: 'line' | 'card' | 'editable-card'
  size?: Size
  centered?: boolean
}

export interface TabItem {
  key: string
  label: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  closable?: boolean
}

// 表格组件Props
export interface TableProps<T = unknown> extends BaseComponentProps {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: TablePagination
  rowKey?: keyof T | ((record: T) => string)
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>
}

export interface TableColumn<T = unknown> {
  key: string
  title: React.ReactNode
  dataIndex?: keyof T
  width?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  sorter?: boolean | ((a: T, b: T) => number)
}

export interface TablePagination {
  current: number
  pageSize: number
  total: number
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  pageSizeOptions?: string[]
  onChange?: (page: number, pageSize: number) => void
}

// 表单组件Props
export interface FormProps extends BaseComponentProps {
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelAlign?: 'left' | 'right'
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
  onSubmit?: (values: Record<string, unknown>) => void
  onValuesChange?: (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void
}

export interface FormItemProps extends BaseComponentProps {
  name?: string
  label?: React.ReactNode
  required?: boolean
  rules?: FormRule[]
  help?: React.ReactNode
  validateStatus?: 'success' | 'warning' | 'error' | 'validating'
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
}

export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (rule: FormRule, value: unknown) => Promise<void> | void
} 