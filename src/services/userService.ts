import { get, post } from '@/services/api'
import type { User, LoginRequest, LoginResponse } from '@/types'

// 用户登录
export const login = (params: LoginRequest): Promise<LoginResponse> =>
  post<LoginResponse>('/auth/login', params)

// 获取用户信息
export const getUserInfo = (): Promise<User> =>
  get<User>('/user/profile')

// 更新用户信息
export const updateUserInfo = (params: Partial<User>): Promise<User> =>
  post<User>('/user/profile', params) 