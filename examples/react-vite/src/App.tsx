import { LinkExchange } from '@link-exchange/react'
import Footer from './Footer'
import './App.css'

// 配置
const USE_LOCAL_SERVER = true // 使用本地测试服务器
const LOCAL_SERVER_URL = 'http://localhost:8080/test-badges.json'
const REMOTE_URL = 'https://example.com/badges.json'

function App() {
  // 开启日志
  console.log('%c🚀 Link Exchange React App', 'color: #61dafb; font-weight: bold; font-size: 14px')
  console.log('配置源:', USE_LOCAL_SERVER ? LOCAL_SERVER_URL : REMOTE_URL)
  if (USE_LOCAL_SERVER) {
    console.log('%c💡 确保本地测试服务器正在运行: node examples/server.mjs', 'color: #ff9800')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Link Exchange React Vite Example</h1>
        <p>在 React + Vite 应用中演示 Link Exchange Badge 组件</p>
        {USE_LOCAL_SERVER && (
          <div style={{
            padding: '8px 12px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '14px',
            marginTop: '10px'
          }}>
            💡 使用本地测试服务器 | <code>node examples/server.mjs</code>
          </div>
        )}
      </header>

      <main className="app-main">
        <section className="example-section">
          <h2>基础示例</h2>
          <p>使用最小配置的 LinkExchange 组件：</p>
          <div className="example-container">
            <LinkExchange
              source={USE_LOCAL_SERVER ? LOCAL_SERVER_URL : REMOTE_URL}
              siteId="react-vite-example"
              telemetry={{
                enabled: true,
                onEvent: (event) => console.log('[Basic Example]', event.type, event)
              }}
            />
          </div>
        </section>

        <section className="example-section">
          <h2>完整配置示例</h2>
          <p>Footer 组件使用完整配置选项：</p>
          <div className="example-container">
            <Footer useLocalServer={USE_LOCAL_SERVER} />
          </div>
        </section>

        <section className="example-section">
          <h2>测试说明</h2>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>✅ 点击徽章查看控制台埋点事件</li>
            <li>✅ 刷新页面测试缓存功能（5秒 TTL）</li>
            <li>✅ 打开控制台查看详细日志</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
