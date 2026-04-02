// API 相关类型定义

import type { LoadingState } from '@/types/global'

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API 响应基础类型
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  code: number
  timestamp?: string
}

// API 错误类型
export interface ApiError {
  message: string
  code: number
  details?: Record<string, unknown>
  stack?: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 请求状态类型
export interface RequestState<T = unknown> {
  data: T | null
  loading: LoadingState
  error: string | null
}

// 用户相关API类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 文件上传类型
export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

// 搜索参数类型
export interface SearchParams {
  keyword?: string
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

// API 配置类型
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
  withCredentials?: boolean
} 