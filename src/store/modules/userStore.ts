import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserInfo } from '@/services'

/**
 * 用户状态接口
 */
interface UserState {
  // 状态
  token: string | null
  userInfo: UserInfo | null
  isLogin: boolean

  // Actions
  setToken: (token: string) => void
  setUserInfo: (userInfo: UserInfo) => void
  login: (token: string, userInfo: UserInfo) => void
  logout: () => void
  updateUserInfo: (userInfo: Partial<UserInfo>) => void
}

/**
 * 用户状态管理
 * 使用 persist 中间件持久化到 localStorage
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      token: null,
      userInfo: null,
      isLogin: false,

      // 设置 token
      setToken: token => {
        set({ token, isLogin: !!token })
      },

      // 设置用户信息
      setUserInfo: userInfo => {
        set({ userInfo })
      },

      // 登录
      login: (token, userInfo) => {
        set({
          token,
          userInfo,
          isLogin: true,
        })
      },

      // 登出
      logout: () => {
        set({
          token: null,
          userInfo: null,
          isLogin: false,
        })
      },

      // 更新用户信息
      updateUserInfo: newUserInfo => {
        const currentUserInfo = get().userInfo
        if (currentUserInfo) {
          set({
            userInfo: {
              ...currentUserInfo,
              ...newUserInfo,
            },
          })
        }
      },
    }),
    {
      name: 'user-storage', // localStorage 的 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
      // 可选: 指定需要持久化的字段
      partialize: state => ({
        token: state.token,
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
    }
  )
)

// 导出选择器 hooks (可选,用于性能优化)
export const useToken = () => useUserStore(state => state.token)
export const useUserInfo = () => useUserStore(state => state.userInfo)
export const useIsLogin = () => useUserStore(state => state.isLogin)
