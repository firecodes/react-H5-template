import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConfigProvider } from 'antd-mobile'
import VConsole from 'vconsole'
import { store, persistor } from '@/store'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import { Loading } from '@/components'
import BottomTabBar from '@/components/BottomTabBar'
import { useLanguage } from '@/hooks/useLanguage'
import '@/i18n'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import '@/styles/layout.css'

// 开发环境启用vConsole
if (import.meta.env.MODE === 'development') {
  new VConsole()
}

const AppContent: React.FC = () => {
  const { getAntdLocale } = useLanguage()

  useEffect(() => {
    // 设置viewport meta标签
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    }
  }, [])

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <Router>
        <div className="app">
          <div className="body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <div className="bottom">
            <BottomTabBar />
          </div>
        </div>
      </Router>
    </ConfigProvider>
  )
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading text="Loading..." />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App
