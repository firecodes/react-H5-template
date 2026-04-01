import { Button, ErrorBlock } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <ErrorBlock status="empty" title="404" description="抱歉,您访问的页面不存在" />
      <div className={styles.buttonGroup}>
        <Button color="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
        <Button onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
    </div>
  )
}

export default NotFound
