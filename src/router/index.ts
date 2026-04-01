
import routes from './routes';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

export default createBrowserRouter(routes);

/**
 * 生成路由表
 * @param routes 路由数组
 * @returns
 */
export function generateRouter(routes: RouteObject[]) {
  return createBrowserRouter(routes);
}
