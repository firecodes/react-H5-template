/**
 * 格式化工具函数
 */

/**
 * 格式化手机号
 * @param phone 手机号
 * @returns 格式化后的手机号 (如: 138****8888)
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数,默认 2 位
 * @returns 格式化后的金额 (如: 1,234.56)
 */
export const formatMoney = (amount: number, decimals = 2): string => {
  return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式,默认 'YYYY-MM-DD HH:mm:ss'
 */
export const formatDate = (date: Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = typeof date === 'number' ? new Date(date) : date

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

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的大小 (如: 1.23 MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化相对时间
 * @param date 日期对象或时间戳
 * @returns 相对时间描述 (如: 3分钟前)
 */
export const formatRelativeTime = (date: Date | number): string => {
  const timestamp = typeof date === 'number' ? date : date.getTime()
  const now = Date.now()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(timestamp, 'YYYY-MM-DD')
  }
}
