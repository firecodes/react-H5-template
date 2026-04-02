import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
const IS_DEBUG = import.meta.env.VITE_DEBUG === 'true'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 调试模式下打印请求信息
    if (IS_DEBUG) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        data: config.data,
      })
    }
    
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    if (IS_DEBUG) {
      console.error('API Request Error:', error)
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 调试模式下打印响应信息
    if (IS_DEBUG) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      })
    }
    return response.data
  },
  (error) => {
    if (IS_DEBUG) {
      console.error('API Response Error:', error)
    }
    
    // 统一错误处理
    if (error.response?.status === 401) {
      // 清除token，跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 通用请求函数
export const request = <T>(config: AxiosRequestConfig): Promise<T> =>
  apiClient.request(config)

// GET请求
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.get<T>(url, config) as Promise<T>

// POST请求
export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> =>
  apiClient.post<T>(url, data, config) as Promise<T>

// PUT请求
export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> =>
  apiClient.put<T>(url, data, config) as Promise<T>

// DELETE请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.delete<T>(url, config) as Promise<T>

// 导出配置信息供调试使用
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  isDebug: IS_DEBUG,
}

// 导出axios实例供其他地方使用
export default apiClient 