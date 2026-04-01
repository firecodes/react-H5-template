/**
 * Hooks 统一导出
 * 基础 Hooks 使用 ahooks (https://ahooks.js.org/)
 *
 * 常用 hooks:
 * - useRequest: 管理异步数据请求
 * - useDebounce/useDebounceFn: 防抖
 * - useThrottle/useThrottleFn: 节流
 * - useLocalStorageState/useSessionStorageState: 持久化状态
 * - useMount/useUnmount: 生命周期
 * - useInterval/useTimeout: 定时器
 * - useToggle/useBoolean: 布尔值状态
 * - useUpdateEffect: 忽略首次执行的 useEffect
 */

// 导出 ahooks 常用 hooks
export {
  useRequest,
  useDebounce,
  useDebounceFn,
  useThrottle,
  useThrottleFn,
  useLocalStorageState,
  useSessionStorageState,
  useMount,
  useUnmount,
  useUpdateEffect,
  useInterval,
  useTimeout,
  useToggle,
  useBoolean,
  useSetState,
  useMap,
  useSet,
  usePrevious,
  useLatest,
  useMemoizedFn,
  useCreation,
  useEventListener,
  useClickAway,
  useTitle,
  useNetwork,
} from 'ahooks'

// 如果有自定义 hooks,可以在这里添加
// export * from './useCustomHook'
