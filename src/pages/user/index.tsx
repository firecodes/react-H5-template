import { Button, Card, Avatar, List, Dialog } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { UserOutline, MailOutline, PhonebookOutline } from 'antd-mobile-icons'
import { useUserStore, useUserInfo } from '../../store'
import { formatPhone } from '../../utils'
import styles from './index.module.less'

const User = () => {
  const navigate = useNavigate()
  const userInfo = useUserInfo()
  const { logout } = useUserStore()

  // 处理登出
  const handleLogout = () => {
    Dialog.confirm({
      content: '确认退出登录?',
      onConfirm: () => {
        logout()
        navigate('/', { replace: true })
      },
    })
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.userInfo}>
          <Avatar
            src={userInfo?.avatar || ''}
            style={{ '--size': '64px', '--border-radius': '50%' }}
          />
          <h2>{userInfo?.username || '未登录'}</h2>
          <p>{userInfo?.email || '暂无邮箱信息'}</p>
        </div>
      </Card>

      <Card title="个人信息" style={{ marginTop: '16px' }}>
        <List>
          <List.Item prefix={<UserOutline />}>用户名: {userInfo?.username || '-'}</List.Item>
          <List.Item prefix={<MailOutline />}>邮箱: {userInfo?.email || '-'}</List.Item>
          <List.Item prefix={<PhonebookOutline />}>
            电话: {userInfo?.phone ? formatPhone(userInfo.phone) : '-'}
          </List.Item>
        </List>
      </Card>

      <div className={styles.buttonGroup}>
        <Button color="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
        {userInfo && (
          <Button color="danger" onClick={handleLogout}>
            退出登录
          </Button>
        )}
      </div>
    </div>
  )
}

export default User
