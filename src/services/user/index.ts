import { http } from '@/utils/request'
import type { UserLoginParams, UserLoginResponse, UserInfo, UserUpdateParams } from './types'

/**
 * 用户相关 API
 */
export const UserAPI = {
  /**
   * 用户登录
   */
  login(params: UserLoginParams) {
    return http.post<UserLoginResponse>('/user/login', params)
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return http.get<UserInfo>('/user/info')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(data: UserUpdateParams) {
    return http.put<UserInfo>('/user/info', data)
  },

  /**
   * 退出登录
   */
  logout() {
    return http.post<void>('/user/logout')
  },
}

// 导出类型
export type { UserInfo, UserLoginParams, UserLoginResponse, UserUpdateParams } from './types'
