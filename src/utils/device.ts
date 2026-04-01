/**
 * 设备检测工具
 */

/**
 * 判断是否是移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 判断是否是 iOS 设备
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * 判断是否是 Android 设备
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent)
}

/**
 * 判断是否是微信浏览器
 */
export const isWeChat = (): boolean => {
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 获取设备信息
 */
export const getDeviceInfo = () => {
  return {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isWeChat: isWeChat(),
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  }
}
