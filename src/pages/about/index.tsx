import { Button, Card, List } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <Card title="关于">
        <div className={styles.content}>
          <h2>技术栈</h2>
          <List>
            <List.Item>React 18.3.1</List.Item>
            <List.Item>antd-mobile 5.x</List.Item>
            <List.Item>React Router 6.x</List.Item>
            <List.Item>TypeScript</List.Item>
            <List.Item>Vite</List.Item>
            <List.Item>Less</List.Item>
          </List>
          <div className={styles.buttonGroup}>
            <Button color="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default About
