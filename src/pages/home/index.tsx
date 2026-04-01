import { Button, Card, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useUserStore, useIsLogin } from '../../store'
import styles from './index.module.less'

const Home = () => {
  const navigate = useNavigate()
  const isLogin = useIsLogin()
  const { login } = useUserStore()

  // 模拟登录
  const handleMockLogin = () => {
    // 模拟登录数据
    const mockToken = 'mock-token-' + Date.now()
    const mockUserInfo = {
      id: 1,
      username: '演示用户',
      email: 'demo@example.com',
      avatar: '',
      phone: '13800138000',
    }

    login(mockToken, mockUserInfo)
    Toast.show({
      icon: 'success',
      content: '登录成功',
    })
  }

  return (
    <div className={styles.homePage}>
      <Card title="首页">
        <div className={styles.homePage_content}>
          <h1>欢迎来到 H5 模板</h1>
          <p>这是一个基于 React 18 + antd-mobile 的移动端 H5 模板</p>
          <p>集成了 Zustand 全局状态管理</p>
          <p>当前登录状态: {isLogin ? '已登录 ✅' : '未登录 ❌'}</p>
          <div className={styles.homePage_buttonGroup}>
            {!isLogin && (
              <>
                <Button color="primary" fill="solid" onClick={() => navigate('/login')}>
                  前往登录
                </Button>
                <Button color="primary" fill="outline" onClick={handleMockLogin}>
                  模拟登录（演示）
                </Button>
              </>
            )}
            <Button color="primary" onClick={() => navigate('/about')}>
              关于页面
            </Button>
            <Button color="success" onClick={() => navigate('/user')}>
              用户页面
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Home
