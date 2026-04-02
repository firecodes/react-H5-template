import { useTranslation } from 'react-i18next'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import enUS from 'antd-mobile/es/locales/en-US'

export const useLanguage = () => {
  const { i18n, t } = useTranslation()

  const currentLanguage = i18n.language

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
  }

  const getAntdLocale = () => {
    switch (currentLanguage) {
      case 'en-US':
        return enUS
      case 'zh-CN':
      default:
        return zhCN
    }
  }

  const isChineseMode = () => currentLanguage === 'zh-CN'
  const isEnglishMode = () => currentLanguage === 'en-US'

  return {
    currentLanguage,
    changeLanguage,
    getAntdLocale,
    isChineseMode,
    isEnglishMode,
    t
  }
}

export default useLanguage 