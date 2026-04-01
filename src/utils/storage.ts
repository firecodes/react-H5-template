/**
 * 本地存储工具类
 * 支持类型安全和过期时间
 */

interface StorageData<T> {
  value: T
  expire?: number // 过期时间戳
}

class Storage {
  /**
   * 设置存储
   * @param key 键名
   * @param value 值
   * @param expire 过期时间(秒),不传则永久有效
   */
  set<T>(key: string, value: T, expire?: number): void {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire * 1000 : undefined,
    }
    localStorage.setItem(key, JSON.stringify(data))
  }

  /**
   * 获取存储
   * @param key 键名
   * @returns 值或 null
   */
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (!item) return null

    try {
      const data: StorageData<T> = JSON.parse(item)

      // 检查是否过期
      if (data.expire && data.expire < Date.now()) {
        this.remove(key)
        return null
      }

      return data.value
    } catch (error) {
      console.error('解析存储数据失败:', error)
      return null
    }
  }

  /**
   * 移除存储
   * @param key 键名
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * 清空所有存储
   */
  clear(): void {
    localStorage.clear()
  }

  /**
   * 检查键是否存在
   * @param key 键名
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }
}

// 导出单例
export const storage = new Storage()
