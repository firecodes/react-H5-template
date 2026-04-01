/**
 * 全局类型声明
 */

/// <reference types="vite/client" />

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  // 添加更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 扩展 Window 类型
// interface Window {
// 添加全局属性
// }

// 声明图片等资源模块
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}
