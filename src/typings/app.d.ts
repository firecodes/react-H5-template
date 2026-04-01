
interface Window {
  mozRequestAnimationFrame: () => void,

  webkitRequestAnimationFrame: () => void,

  msRequestAnimationFrame: () => void,

  mozCancelAnimationFrame: () => void
}

/**
 * App内数据类型
 */
declare namespace App {

  /**
   * 路由类型
   */
  type Route = {
    index?: boolean
    id: string
    path?: string
    component: string
    redirect?: string
    children?: Array<Route>
    handle?: Handle
    parent?: string
    protected?: boolean
  }

  type Handle = {
    title?: string
    icon?: string
    roles?: string[] // 'admin' | 'other'
  }

}
