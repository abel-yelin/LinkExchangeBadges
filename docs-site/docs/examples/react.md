# React 示例

本节展示如何在 React 项目中使用 Link Exchange Badges SDK。

## Vite + React 示例

### 1. 安装依赖

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install @link-exchange/react
```

### 2. 基础使用

```jsx
// src/App.jsx
import { LinkExchange } from '@link-exchange/react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的网站</h1>
        <p>使用 Link Exchange Badges</p>
      </header>

      <main>
        <section>
          <h2>合作伙伴</h2>
          <LinkExchange
            source="https://cdn.example.com/badges.json"
            group="partners"
          />
        </section>
      </main>

      <footer>
        <LinkExchange
          source="https://cdn.example.com/badges.json"
          group="technologies"
        />
      </footer>
    </div>
  )
}

export default App
```

### 3. 完整配置示例

```jsx
// src/App.jsx
import { useState, useEffect } from 'react'
import { LinkExchange } from '@link-exchange/react'
import './App.css'

function App() {
  const [environment, setEnvironment] = useState('development')

  useEffect(() => {
    // 根据构建环境设置
    setEnvironment(import.meta.env.MODE)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的网站</h1>
        <p>Link Exchange Badges React 示例</p>
      </header>

      <main className="App-main">
        <section className="section">
          <h2>合作伙伴</h2>
          <div className="section-content">
            <LinkExchange
              source={import.meta.env.VITE_BADGES_URL}
              siteId="my-react-app"
              group="partners"
              environment={environment}
              locale="zh-CN"
              cache={{
                enabled: true,
                ttlMs: 30 * 60 * 1000
              }}
              security={{
                allowedLinkDomains: ['github.com', 'npmjs.com'],
                allowedImageDomains: ['img.shields.io', 'github.com']
              }}
              telemetry={{
                enabled: true,
                onEvent: (event) => {
                  console.log('[Badge Event]', event.type, event)
                }
              }}
            />
          </div>
        </section>

        <section className="section">
          <h2>技术栈</h2>
          <div className="section-content">
            <LinkExchange
              as="section"
              source={import.meta.env.VITE_BADGES_URL}
              group="technologies"
            />
          </div>
        </section>

        <section className="section">
          <h2>认证与奖项</h2>
          <div className="section-content">
            <LinkExchange
              as="div"
              source={import.meta.env.VITE_BADGES_URL}
              group="certifications"
              environment="production"
            />
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 My Website. All rights reserved.</p>
        <LinkExchange
          as="footer"
          source={import.meta.env.VITE_BADGES_URL}
          className="footer-badges"
        />
      </footer>
    </div>
  )
}

export default App
```

### 4. 环境变量配置

```bash
# .env.development
VITE_BADGES_URL=http://localhost:8080/badges.json

# .env.production
VITE_BADGES_URL=https://cdn.example.com/badges.json
```

## Create React App 示例

### 1. 创建项目

```bash
npx create-react-app my-app
cd my-app
npm install @link-exchange/react
```

### 2. 使用组件

```jsx
// src/App.js
import { LinkExchange } from '@link-exchange/react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的网站</h1>
      </header>

      <main>
        <LinkExchange
          source={process.env.REACT_APP_BADGES_URL}
          siteId="my-cra-app"
          environment={process.env.NODE_ENV}
        />
      </main>
    </div>
  )
}

export default App
```

## 自定义组件封装

### 1. 创建封装组件

```jsx
// src/components/BadgeSection.jsx
import { memo } from 'react'
import { LinkExchange } from '@link-exchange/react'

const BadgeSection = memo(function BadgeSection({
  title,
  group,
  environment,
  className = ''
}) {
  return (
    <section className={`badge-section ${className}`}>
      <h2>{title}</h2>
      <LinkExchange
        source={process.env.REACT_APP_BADGES_URL}
        group={group}
        environment={environment}
        cache={{ enabled: true, ttlMs: 1800000 }}
      />
    </section>
  )
})

export default BadgeSection
```

### 2. 使用封装组件

```jsx
// src/App.jsx
import BadgeSection from './components/BadgeSection'

function App() {
  return (
    <div className="App">
      <BadgeSection
        title="合作伙伴"
        group="partners"
        environment={process.env.NODE_ENV}
      />
      <BadgeSection
        title="技术栈"
        group="technologies"
        environment={process.env.NODE_ENV}
      />
    </div>
  )
}
```

## 上下文集成

### 1. 创建 Context

```jsx
// src/contexts/BadgesContext.jsx
import { createContext, useContext } from 'react'

const BadgesContext = createContext({
  badgesUrl: '',
  siteId: '',
  environment: 'production'
})

export const useBadgesConfig = () => {
  const context = useContext(BadgesContext)
  if (!context) {
    throw new Error('useBadgesConfig must be used within BadgesProvider')
  }
  return context
}

export const BadgesProvider = ({ children, config }) => {
  return (
    <BadgesContext.Provider value={config}>
      {children}
    </BadgesContext.Provider>
  )
}
```

### 2. 使用 Context

```jsx
// src/App.jsx
import { BadgesProvider, useBadgesConfig } from './contexts/BadgesContext'
import { LinkExchange } from '@link-exchange/react'

function Footer() {
  const config = useBadgesConfig()

  return (
    <footer>
      <LinkExchange {...config} />
    </footer>
  )
}

function App() {
  const config = {
    badgesUrl: process.env.REACT_APP_BADGES_URL,
    siteId: 'my-app',
    environment: process.env.NODE_ENV
  }

  return (
    <BadgesProvider config={config}>
      <Footer />
    </BadgesProvider>
  )
}
```

## 错误边界

```jsx
// src/components/BadgeErrorBoundary.jsx
import { Component } from 'react'

class BadgeErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Badge Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>徽章加载失败</div>
    }

    return this.props.children
  }
}

export default BadgeErrorBoundary
```

使用错误边界：

```jsx
import BadgeErrorBoundary from './components/BadgeErrorBoundary'
import { LinkExchange } from '@link-exchange/react'

function App() {
  return (
    <BadgeErrorBoundary
      fallback={<div>徽章暂时无法显示</div>}
    >
      <LinkExchange
        source="https://cdn.example.com/badges.json"
      />
    </BadgeErrorBoundary>
  )
}
```

## 加载状态

```jsx
import { useState, useEffect } from 'react'
import { LinkExchange } from '@link-exchange/react'

function BadgeSection({ title, ...props }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.type === 'render_success') {
        setLoading(false)
      } else if (event.type === 'render_failed') {
        setLoading(false)
        setError(event.error)
      }
    }

    // 设置事件监听
    window.addEventListener('badge-event', handleEvent)

    return () => {
      window.removeEventListener('badge-event', handleEvent)
    }
  }, [])

  return (
    <section>
      <h2>{title}</h2>
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}
      <LinkExchange
        {...props}
        telemetry={{
          enabled: true,
          onEvent: (event) => {
            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('badge-event', { detail: event }))
          }
        }}
      />
    </section>
  )
}
```

## 样式定制

### 1. 使用 CSS Modules

```css
/* src/components/BadgeSection.module.css */
.badgeSection {
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
}

.badgeSection h2 {
  color: #667eea;
  margin-bottom: 15px;
}

.badges {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .badges {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

```jsx
// src/components/BadgeSection.jsx
import styles from './BadgeSection.module.css'
import { LinkExchange } from '@link-exchange/react'

function BadgeSection({ title, ...props }) {
  return (
    <section className={styles.badgeSection}>
      <h2>{title}</h2>
      <div className={styles.badges}>
        <LinkExchange {...props} />
      </div>
    </section>
  )
}
```

### 2. 使用 Tailwind CSS

```jsx
import { LinkExchange } from '@link-exchange/react'

function BadgeSection({ title, ...props }) {
  return (
    <section className="p-5 bg-white rounded-lg my-5">
      <h2 className="text-xl font-semibold text-purple-600 mb-4">{title}</h2>
      <div className="flex gap-4 flex-wrap">
        <LinkExchange {...props} />
      </div>
    </section>
  )
}
```

## 测试

### 单元测试

```jsx
// src/components/__tests__/BadgeSection.test.jsx
import { render, screen } from '@testing-library/react'
import { LinkExchange } from '@link-exchange/react'

describe('LinkExchange', () => {
  it('renders without crashing', () => {
    render(
      <LinkExchange
        source="https://cdn.example.com/badges.json"
      />
    )
  })

  it('uses custom container element', () => {
    const { container } = render(
      <LinkExchange
        as="footer"
        source="https://cdn.example.com/badges.json"
      />
    )

    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('passes props correctly', () => {
    render(
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        siteId="test-site"
        group="test-group"
      />
    )

    // 验证组件是否正确接收 props
    // 具体验证逻辑取决于你的实现
  })
})
```

## 性能优化

### 1. 使用 React.memo

```jsx
import { memo } from 'react'
import { LinkExchange } from '@link-exchange/react'

const Footer = memo(function Footer({ badgesUrl }) {
  return (
    <footer>
      <LinkExchange source={badgesUrl} />
    </footer>
  )
})
```

### 2. 懒加载

```jsx
import { lazy, Suspense } from 'react'

const LinkExchange = lazy(() => import('@link-exchange/react'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LinkExchange source="https://cdn.example.com/badges.json" />
    </Suspense>
  )
}
```

## 下一步

- [Next.js 示例](/examples/nextjs)
- [HTML 示例](/examples/html)
- [API 参考](/api/react)
