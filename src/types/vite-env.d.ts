/// <reference types="vite/client" />

// 扩展环境变量类型
interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_BASE_URL: string
  
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // 代理配置
  readonly VITE_PROXY_TARGET: string
  
  // 调试配置
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  
  // 开发工具配置
  readonly VITE_MOCK_API: string
  readonly VITE_HOT_RELOAD: string
  
  // 其他可选配置
  readonly VITE_PORT?: string
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_PERSONAL_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 