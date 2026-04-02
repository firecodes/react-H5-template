// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastExecTime = 0
  return (...args: Parameters<T>) => {
    const currentTime = Date.now()
    if (currentTime - lastExecTime >= delay) {
      func(...args)
      lastExecTime = currentTime
    }
  }
}

// 格式化日期
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    Object.keys(obj).forEach(key => {
      clonedObj[key as keyof T] = deepClone(obj[key as keyof T])
    })
    return clonedObj
  }
  return obj
}

// 本地存储工具
export const storage = {
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('存储失败:', error)
    }
  },
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('获取存储失败:', error)
      return null
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('移除存储失败:', error)
    }
  },
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('清空存储失败:', error)
    }
  }
}

// 获取URL参数
export const getUrlParams = (url?: string): Record<string, string> => {
  const searchParams = new URLSearchParams(url || window.location.search)
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

// 导出classnames工具
export * from '@/utils/classnames' 