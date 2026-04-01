import type { RouteObject } from 'react-router-dom'
import Home from '@/pages/home'
import About from '@/pages/about'
import User from '@/pages/user'
import Login from '@/pages/login'
import NotFound from '@/pages/notFound'

// 路由元信息
export interface RouteMeta {
  title?: string // 页面标题
  requiresAuth?: boolean // 是否需要认证
  keepAlive?: boolean // 是否缓存
}

export interface RouteConfig extends Omit<RouteObject, 'children'> {
  meta?: RouteMeta
  children?: RouteConfig[]
}

// 路由表配置
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
    meta: {
      title: '首页',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    element: <About />,
    meta: {
      title: '关于',
      requiresAuth: false,
    },
  },
  {
    path: '/user',
    element: <User />,
    meta: {
      title: '用户中心',
      requiresAuth: true, // 需要登录才能访问
    },
  },
  {
    path: '*',
    element: <NotFound />,
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
]

export default routes
