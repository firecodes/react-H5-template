/**
 * 用户相关类型定义
 */

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
}

// 登录参数
export interface UserLoginParams {
  username: string
  password: string
}

// 登录响应
export interface UserLoginResponse {
  token: string
  userInfo: UserInfo
}

// 更新用户信息参数
export interface UserUpdateParams {
  email?: string
  avatar?: string
  phone?: string
}
