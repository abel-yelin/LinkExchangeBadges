# React 集成指南

本指南详细介绍如何在 React 项目中集成 Link Exchange Badges SDK。

## 安装

### npm

```bash
npm install @link-exchange/react
```

### yarn

```bash
yarn add @link-exchange/react
```

### pnpm

```bash
pnpm add @link-exchange/react
```

## 基础使用

### 1. 导入组件

```jsx
import { LinkExchange } from '@link-exchange/react'
```

### 2. 使用组件

```jsx
function App() {
  return (
    <div>
      <h1>我的网站</h1>
      <LinkExchange
        source="https://cdn.example.com/badges.json"
      />
    </div>
  )
}
```

### 3. 完整示例

```jsx
import { LinkExchange } from '@link-exchange/react'

function App() {
  return (
    <div className="App">
      <header>
        <h1>欢迎</h1>
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

## 配置选项

### 环境变量

创建 `.env` 文件：

```bash
REACT_APP_BADGES_URL=https://cdn.example.com/badges.json
REACT_APP_SITE_ID=my-react-app
```

使用环境变量：

```jsx
function App() {
  return (
    <LinkExchange
      source={process.env.REACT_APP_BADGES_URL}
      siteId={process.env.REACT_APP_SITE_ID}
    />
  )
}
```

### TypeScript 支持

```tsx
import { LinkExchange } from '@link-exchange/react'
import type { LinkExchangeProps } from '@link-exchange/react'

const config: LinkExchangeProps = {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-react-app',
  environment: 'production'
}

function App() {
  return <LinkExchange {...config} />
}
```

## 高级用法

### 自定义容器元素

```jsx
<LinkExchange
  as="footer"
  source="https://cdn.example.com/badges.json"
/>
```

支持的元素类型：
- `'div'`（默认）
- `'footer'`
- `'section'`
- `'nav'`
- `'main'`
- `'article'`
- `'aside'`

### 遥测集成

```jsx
import { useEffect } from 'react'
import { LinkExchange } from '@link-exchange/react'

function App() {
  useEffect(() => {
    // 设置全局分析
    if (window.analytics) {
      window.analytics.page('Badges Viewed')
    }
  }, [])

  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          console.log('[Badge Event]', event.type, event)

          // 发送到分析平台
          if (window.analytics) {
            window.analytics.track(event.type, event)
          }
        }
      }}
    />
  )
}
```

### 错误处理

```jsx
import { useState } from 'react'
import { LinkExchange } from '@link-exchange/react'

function App() {
  const [error, setError] = useState(null)

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <LinkExchange
        source="https://cdn.example.com/badges.json"
        fallback={{
          silent: false,
          snapshot: {
            configVersion: '1',
            schemaVersion: '1.0.0',
            updatedAt: new Date().toISOString(),
            badges: [
              {
                id: 'github',
                name: 'GitHub',
                enabled: true,
                renderType: 'image',
                imageUrl: 'https://img.shields.io/badge/GitHub-100000?logo=github',
                linkUrl: 'https://github.com'
              }
            ]
          }
        }}
        telemetry={{
          enabled: true,
          onEvent: (event) => {
            if (event.type === 'render_failed') {
              setError(event.error)
            }
          }
        }}
      />
    </div>
  )
}
```

## 组件封装

### 基础封装

```jsx
// components/BadgesSection.jsx
import { memo } from 'react'
import { LinkExchange } from '@link-exchange/react'

const BadgesSection = memo(function BadgesSection({
  title,
  group,
  className = ''
}) {
  return (
    <section className={`badges-section ${className}`}>
      <h2>{title}</h2>
      <LinkExchange
        source={process.env.REACT_APP_BADGES_URL}
        group={group}
      />
    </section>
  )
})

export default BadgesSection
```

### 高级封装

```jsx
// components/SmartBadges.jsx
import { useMemo } from 'react'
import { LinkExchange } from '@link-exchange/react'

function SmartBadges({ group, locale }) {
  const config = useMemo(() => ({
    source: process.env.REACT_APP_BADGES_URL,
    siteId: process.env.REACT_APP_SITE_ID,
    environment: process.env.NODE_ENV,
    group,
    locale,
    cache: {
      enabled: true,
      ttlMs: 30 * 60 * 1000
    },
    telemetry: {
      enabled: true,
      onEvent: (event) => {
        // 发送到分析平台
        if (window.analytics) {
          window.analytics.track(event.type, event)
        }
      }
    }
  }), [group, locale])

  return <LinkExchange {...config} />
}

export default SmartBadges
```

## Context 集成

### 创建 Context

```jsx
// contexts/BadgesContext.jsx
import { createContext, useContext } from 'react'

const BadgesContext = createContext({
  badgesUrl: '',
  siteId: '',
  environment: 'production'
})

export const useBadges = () => {
  const context = useContext(BadgesContext)
  if (!context) {
    throw new Error('useBadges must be used within BadgesProvider')
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

### 使用 Context

```jsx
// App.jsx
import { BadgesProvider, useBadges } from './contexts/BadgesContext'
import { LinkExchange } from '@link-exchange/react'

function Footer() {
  const config = useBadges()

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

## 性能优化

### 使用 React.memo

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

### 懒加载

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

### useMemo 优化

```jsx
import { useMemo } from 'react'
import { LinkExchange } from '@link-exchange/react'

function App({ siteId, group }) {
  const props = useMemo(() => ({
    source: process.env.REACT_APP_BADGES_URL,
    siteId,
    group,
    cache: { enabled: true, ttlMs: 1800000 }
  }), [siteId, group])

  return <LinkExchange {...props} />
}
```

## 样式集成

### CSS Modules

```jsx
// components/BadgesSection.jsx
import styles from './BadgesSection.module.css'
import { LinkExchange } from '@link-exchange/react'

function BadgesSection() {
  return (
    <section className={styles.section}>
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        className={styles.badges}
      />
    </section>
  )
}
```

### Tailwind CSS

```jsx
import { LinkExchange } from '@link-exchange/react'

function App() {
  return (
    <div className="container mx-auto px-4">
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        className="flex gap-4 flex-wrap"
      />
    </div>
  )
}
```

### Styled Components

```jsx
import styled from 'styled-components'
import { LinkExchange } from '@link-exchange/react'

const StyledSection = styled.section`
  padding: 2rem;
  background: white;
  border-radius: 8px;
`

const BadgesWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

function App() {
  return (
    <StyledSection>
      <BadgesWrapper>
        <LinkExchange source="https://cdn.example.com/badges.json" />
      </BadgesWrapper>
    </StyledSection>
  )
}
```

## 测试

### 单元测试

```jsx
// BadgesSection.test.jsx
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

  it('passes props correctly', () => {
    render(
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        siteId="test-site"
        group="test-group"
      />
    )
    // 验证 props 传递
  })
})
```

## 框架特定

### Vite

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### Create React App

```jsx
// index.js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

## 最佳实践

### 1. 组件分层

```jsx
// App.jsx - 应用组件
import { BadgesProvider } from './contexts/BadgesContext'
import { Footer } from './components/Footer'

function App() {
  return (
    <BadgesProvider config={config}>
      <Footer />
    </BadgesProvider>
  )
}

// components/Footer/index.jsx - 布局组件
import { Badges } from './Badges'

export function Footer() {
  return (
    <footer>
      <Badges group="footer" />
    </footer>
  )
}

// components/Footer/Badges.jsx - 展示组件
import { LinkExchange } from '@link-exchange/react'

export function Badges({ group }) {
  const config = useBadges()
  return <LinkExchange {...config} group={group} />
}
```

### 2. 配置集中管理

```jsx
// config/badges.js
export const badgesConfig = {
  development: {
    source: 'http://localhost:8080/badges.json',
    cache: { enabled: false }
  },
  production: {
    source: 'https://cdn.example.com/badges.json',
    cache: { enabled: true, ttlMs: 1800000 }
  }
}

export function getBadgesConfig() {
  return badgesConfig[process.env.NODE_ENV]
}
```

### 3. 类型安全

```tsx
// types/badges.ts
export interface BadgesConfig {
  source: string
  siteId: string
  group?: string
}

// components/Badges.tsx
import type { BadgesConfig } from '@/types/badges'

function Badges(config: BadgesConfig) {
  return <LinkExchange {...config} />
}
```

## 常见问题

### Q: 组件不渲染？

确保使用客户端渲染（React 18+ 不需要）。

### Q: 类型错误？

安装类型定义：

```bash
npm install --save-dev @types/react @types/react-dom
```

### Q: 性能问题？

使用 React.memo 和 useMemo 优化。

## 下一步

- [Next.js 集成](/guide/nextjs-integration)
- [HTML 集成](/guide/html-integration)
- [示例](/examples/react)
