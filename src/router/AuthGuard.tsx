import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { useIsLogin } from '@/store'
import routes from './routes'
import type { RouteConfig } from './routes'

interface AuthGuardProps {
  children: ReactNode
}

// 递归查找当前路由配置
const findRouteConfig = (routes: RouteConfig[], pathname: string): RouteConfig | undefined => {
  for (const route of routes) {
    // 精确匹配
    if (route.path === pathname) {
      return route
    }

    // 动态路由匹配 (如 /user/:id)
    if (route.path && route.path.includes(':')) {
      const routeSegments = route.path.split('/')
      const pathSegments = pathname.split('/')

      if (routeSegments.length === pathSegments.length) {
        const isMatch = routeSegments.every((segment, index) => {
          // 如果是动态参数 (以 : 开头)，则匹配任意值
          if (segment.startsWith(':')) {
            return true
          }
          // 否则必须精确匹配
          return segment === pathSegments[index]
        })

        if (isMatch) {
          return route
        }
      }
    }

    // 通配符匹配 (如 /admin/*)
    if (route.path && route.path.endsWith('*')) {
      const basePath = route.path.slice(0, -1) // 移除末尾的 *
      if (pathname.startsWith(basePath)) {
        return route
      }
    }

    // 递归查找子路由
    if (route.children) {
      const found = findRouteConfig(route.children, pathname)
      if (found) return found
    }
  }
  return undefined
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = useIsLogin() // 从 Zustand store 获取登录状态

  useEffect(() => {
    // 查找当前路由配置
    const currentRoute = findRouteConfig(routes, location.pathname)

    // 如果路由需要认证但用户未登录
    if (currentRoute?.meta?.requiresAuth && !isLogin) {
      Toast.show({
        icon: 'fail',
        content: '请先登录',
      })
      // 跳转到登录页面，并保存当前路径以便登录后跳转回来
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      })
      return
    }

    // 如果已登录用户访问登录页，重定向到首页
    if (location.pathname === '/login' && isLogin) {
      navigate('/', { replace: true })
      return
    }

    // 设置页面标题
    if (currentRoute?.meta?.title) {
      document.title = currentRoute.meta.title
    }
  }, [location.pathname, isLogin, navigate])

  return <>{children}</>
}

export default AuthGuard
