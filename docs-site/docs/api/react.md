# React 组件 API

`@link-exchange/react` 提供了 React 组件封装，让你在 React 应用中轻松使用 Link Exchange Badges。

## LinkExchange

React 组件，用于在 React 应用中展示徽章。

### 导入

```typescript
import { LinkExchange } from '@link-exchange/react'
import type { LinkExchangeProps } from '@link-exchange/react'
```

### Props

LinkExchange 组件接受 `LinkExchangeProps` 类型的属性，它扩展了 `MountOptions` 并添加了一个额外属性：

```typescript
type LinkExchangeProps = MountOptions & {
  as?: 'div' | 'footer' | 'section' | 'nav' | 'main' | 'article' | 'aside'
}
```

### as

容器元素的标签名，默认为 `'div'`。

支持的值：
- `'div'`（默认）
- `'footer'`
- `'section'`
- `'nav'`
- `'main'`
- `'article'`
- `'aside'`

### 基础用法

```jsx
import { LinkExchange } from '@link-exchange/react'

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

### 完整配置

```jsx
import { LinkExchange } from '@link-exchange/react'

function Footer() {
  return (
    <footer>
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        siteId="my-website"
        group="partners"
        environment="production"
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
            console.log('Badge event:', event)
          }
        }}
      />
    </footer>
  )
}
```

### 使用不同的容器元素

```jsx
import { LinkExchange } from '@link-exchange/react'

// 使用 footer 元素
<LinkExchange
  as="footer"
  source="https://cdn.example.com/badges.json"
/>

// 使用 nav 元素
<LinkExchange
  as="nav"
  source="https://cdn.example.com/badges.json"
/>
```

### 与自定义样式结合

```jsx
import { LinkExchange } from '@link-exchange/react'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>&copy; 2024 My Website</p>
        <LinkExchange
          source="https://cdn.example.com/badges.json"
          className="partner-badges"
        />
      </div>
    </footer>
  )
}
```

### 在 Next.js 中使用

由于 SDK 需要访问浏览器 API，需要在客户端组件中使用：

```jsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL}
      environment={process.env.NODE_ENV}
    />
  )
}
```

### 条件渲染

```jsx
import { LinkExchange } from '@link-exchange/react'

function App({ showBadges }) {
  return (
    <div>
      <h1>我的网站</h1>
      {showBadges && (
        <LinkExchange
          source="https://cdn.example.com/badges.json"
        />
      )}
    </div>
  )
}
```

### 与 Context 结合

```jsx
import { createContext, useContext } from 'react'
import { LinkExchange } from '@link-exchange/react'

const ConfigContext = createContext({
  badgesUrl: 'https://cdn.example.com/badges.json',
  siteId: 'my-site'
})

function Footer() {
  const { badgesUrl, siteId } = useContext(ConfigContext)

  return (
    <LinkExchange
      source={badgesUrl}
      siteId={siteId}
    />
  )
}
```

### 错误处理

```jsx
import { LinkExchange } from '@link-exchange/react'

function App() {
  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
      fallback={{
        silent: false,
        snapshot: {
          configVersion: '1',
          schemaVersion: '1.0.0',
          updatedAt: new Date().toISOString(),
          badges: []
        }
      }}
    />
  )
}
```

### 遥测集成

```jsx
import { LinkExchange } from '@link-exchange/react'
import { useAnalytics } from './analytics'

function App() {
  const analytics = useAnalytics()

  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          analytics.track(event.type, event)
        }
      }}
    />
  )
}
```

### 动态配置

```jsx
import { useState } from 'react'
import { LinkExchange } from '@link-exchange/react'

function App() {
  const [group, setGroup] = useState('partners')

  return (
    <div>
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="partners">合作伙伴</option>
        <option value="technologies">技术栈</option>
        <option value="certifications">认证</option>
      </select>

      <LinkExchange
        source="https://cdn.example.com/badges.json"
        group={group}
      />
    </div>
  )
}
```

## 类型定义

### LinkExchangeProps

```typescript
interface LinkExchangeProps extends MountOptions {
  as?: 'div' | 'footer' | 'section' | 'nav' | 'main' | 'article' | 'aside'
}
```

### MountOptions

继承自核心包的 `MountOptions`，详见 [核心 API](/api/core)。

## 依赖

### React 版本

`@link-exchange/react` 需要 React 18 或更高版本。

### Peer Dependencies

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

## 性能优化

### 使用 useMemo

```jsx
import { useMemo } from 'react'
import { LinkExchange } from '@link-exchange/react'

function App({ config }) {
  const options = useMemo(() => ({
    source: config.badgesUrl,
    siteId: config.siteId,
    cache: config.cache
  }), [config])

  return <LinkExchange {...options} />
}
```

### 避免不必要的重新渲染

```jsx
import { memo } from 'react'
import { LinkExchange } from '@link-exchange/react'

const Footer = memo(function Footer() {
  return (
    <footer>
      <LinkExchange
        source="https://cdn.example.com/badges.json"
      />
    </footer>
  )
})
```

## 测试

### 单元测试示例

```jsx
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
})
```

## 故障排查

### 徽章不显示

1. 检查控制台是否有错误
2. 验证 `source` URL 是否可访问
3. 确认配置格式正确
4. 检查徽章是否启用 (`enabled: true`)

### 类型错误

1. 确保 TypeScript 版本 >= 5.0
2. 确认已安装 `@types/react`
3. 检查是否正确导入类型

### 重新渲染问题

组件会在以下依赖变化时重新挂载：
- `source`
- `siteId`
- `group`
- `environment`
- `locale`

其他属性变化不会触发重新挂载。

## 下一步

- [核心 API](/api/core)
- [CDN 脚本 API](/api/script)
- [类型定义](/api/types)
