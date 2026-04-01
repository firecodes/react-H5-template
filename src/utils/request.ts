import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import { useUserStore } from '../store'

/**
 * HTTP 请求封装
 * 基于 axios 实现,包含请求/响应拦截器
 */

// API 响应结构
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 Zustand store 获取 token
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<ApiResponse<T>>): Promise<T> => {
    const { code, data, message } = response.data

    // 根据业务状态码处理
    if (code === 200 || code === 0) {
      return Promise.resolve(data)
    }

    // 处理业务错误
    Toast.show({
      icon: 'fail',
      content: message || '请求失败',
    })
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error: AxiosError) => {
    // 处理 HTTP 错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Toast.show({ icon: 'fail', content: '未授权,请重新登录' })
          // 清除 token,跳转登录页
          useUserStore.getState().logout()
          window.location.hash = '#/'
          break
        case 403:
          Toast.show({ icon: 'fail', content: '没有权限访问' })
          break
        case 404:
          Toast.show({ icon: 'fail', content: '请求的资源不存在' })
          break
        case 500:
          Toast.show({ icon: 'fail', content: '服务器错误' })
          break
        default:
          Toast.show({ icon: 'fail', content: '网络错误' })
      }
    } else if (error.request) {
      Toast.show({ icon: 'fail', content: '网络连接失败' })
    } else {
      Toast.show({ icon: 'fail', content: '请求配置错误' })
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config)
  },
}

export default request
