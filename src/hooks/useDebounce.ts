import { useEffect, useState } from 'react'

/**
 * useDebounce Hook - 防抖钩子
 * 
 * 用于延迟更新值，在指定的延迟时间内如果值发生变化，会重新计时。
 * 常用于搜索输入、窗口大小调整、按钮防重复点击等场景。
 * 
 * @template T - 值的类型
 * @param {T} value - 需要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {T} 防抖后的值
 *
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
} 