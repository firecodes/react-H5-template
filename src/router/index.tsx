import { useRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import routes from './routes'
import AuthGuard from './AuthGuard'

const Router = () => {
  const element = useRoutes(routes as RouteObject[])

  return <AuthGuard>{element}</AuthGuard>
}

export default Router
