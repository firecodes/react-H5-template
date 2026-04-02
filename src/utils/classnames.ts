import classNames from 'classnames'

// 重新导出classnames，方便使用
export const cn = classNames

// 条件类名工具
export const conditional = (
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string => {
  return condition ? trueClass : falseClass || ''
}

// 合并Tailwind类名的工具函数
export const mergeTailwindClasses = (...classes: (string | undefined | null)[]): string => {
  return cn(...classes.filter(Boolean))
}

// 移动端响应式类名工具
export const responsive = {
  mobile: (classes: string) => classes,
  tablet: (classes: string) => `md:${classes}`,
  desktop: (classes: string) => `lg:${classes}`,
}

// 主题相关类名
export const theme = {
  light: (classes: string) => classes,
  dark: (classes: string) => `dark:${classes}`,
}

// 状态相关类名
export const state = {
  hover: (classes: string) => `hover:${classes}`,
  focus: (classes: string) => `focus:${classes}`,
  active: (classes: string) => `active:${classes}`,
  disabled: (classes: string) => `disabled:${classes}`,
}

// 常用的组合类名
export const commonClasses = {
  button: {
    base: 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
  },
  card: {
    base: 'bg-white rounded-lg shadow-sm border border-gray-200',
    hover: 'hover:shadow-md transition-shadow',
    clickable: 'cursor-pointer hover:shadow-md transition-shadow',
  },
  input: {
    base: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
  },
  layout: {
    container: 'max-w-md mx-auto px-4',
    fullHeight: 'min-h-screen',
    centered: 'flex items-center justify-center',
  },
}

export default cn 