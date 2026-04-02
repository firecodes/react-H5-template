// 类型导出文件 - 集中管理所有类型定义

// 全局类型
export * from '@/types/global'

// API 相关类型
export * from '@/types/api'

// 组件相关类型
export * from '@/types/components'

// 重新导出常用类型别名（方便使用）
export type { 
  // 基础类型
  Nullable,
  Optional,
  Maybe,
  ID,
  LoadingState,
  ButtonVariant,
  Size,
  ColorVariant,
  BaseComponentProps,
  ClickableProps,
  FormControlProps
} from '@/types/global'

export type { 
  // API 类型
  ApiResponse,
  ApiError,
  RequestState,
  User,
  LoginRequest,
  LoginResponse
} from '@/types/api'

export type { 
  // 组件Props类型
  ButtonProps,
  InputProps,
  CardProps,
  ModalProps,
  LoadingProps,
  NotificationProps,
  NavBarProps,
  TabsProps,
  TableProps,
  FormProps
} from '@/types/components' 