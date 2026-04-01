import { create } from 'zustand'

/**
 * 应用全局状态接口
 */
interface AppState {
  // 状态
  loading: boolean
  theme: 'light' | 'dark'
  locale: 'zh-CN' | 'en-US'

  // Actions
  setLoading: (loading: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLocale: (locale: 'zh-CN' | 'en-US') => void
  toggleTheme: () => void
}

/**
 * 应用全局状态管理
 */
export const useAppStore = create<AppState>()((set, get) => ({
  // 初始状态
  loading: false,
  theme: 'light',
  locale: 'zh-CN',

  // 设置加载状态
  setLoading: loading => {
    set({ loading })
  },

  // 设置主题
  setTheme: theme => {
    set({ theme })
  },

  // 设置语言
  setLocale: locale => {
    set({ locale })
  },

  // 切换主题
  toggleTheme: () => {
    const currentTheme = get().theme
    set({ theme: currentTheme === 'light' ? 'dark' : 'light' })
  },
}))

// 导出选择器 hooks
export const useLoading = () => useAppStore(state => state.loading)
export const useTheme = () => useAppStore(state => state.theme)
export const useLocale = () => useAppStore(state => state.locale)
