# 最佳实践

本节介绍使用 Link Exchange Badges SDK 的最佳实践。

## 项目结构

### 1. 配置管理

创建集中的配置管理：

```typescript
// config/badges.ts
export const badgesConfig = {
  development: {
    source: process.env.NEXT_PUBLIC_BADGES_URL_DEV || 'http://localhost:8080/badges.json',
    siteId: 'my-app-dev',
    environment: 'development' as const,
    cache: { enabled: false }
  },

  staging: {
    source: 'https://staging-cdn.example.com/badges.json',
    siteId: 'my-app-staging',
    environment: 'staging' as const,
    cache: { enabled: true, ttlMs: 5 * 60 * 1000 }
  },

  production: {
    source: 'https://cdn.example.com/badges.json',
    siteId: 'my-app',
    environment: 'production' as const,
    cache: { enabled: true, ttlMs: 30 * 60 * 1000 },
    security: {
      allowedLinkDomains: ['github.com', 'npmjs.com'],
      allowedImageDomains: ['img.shields.io', 'github.com']
    }
  }
}

export function getBadgesConfig() {
  const env = (process.env.NODE_ENV || 'development') as keyof typeof badgesConfig
  return badgesConfig[env]
}
```

### 2. 组件封装

创建可复用的组件：

```tsx
// components/BadgesSection.tsx
'use client'

import { memo } from 'react'
import { LinkExchange } from '@link-exchange/react'
import { getBadgesConfig } from '@/config/badges'

interface BadgesSectionProps {
  group?: string
  locale?: string
  className?: string
}

export const BadgesSection = memo(function BadgesSection({
  group,
  locale,
  className = ''
}: BadgesSectionProps) {
  const config = getBadgesConfig()

  return (
    <LinkExchange
      {...config}
      group={group}
      locale={locale}
      className={className}
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          console.log('[Badges]', event.type, event)
          // 发送到分析平台
          if (window.analytics) {
            window.analytics.track(event.type, event)
          }
        }
      }}
    />
  )
})
```

## 性能优化

### 1. 懒加载

延迟加载 SDK：

```javascript
// 等待用户滚动到徽章区域
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      import('@link-exchange/react').then(({ LinkExchange }) => {
        // 渲染组件
      })
      observer.unobserve(entry.target)
    }
  })
})

observer.observe(document.querySelector('#badges'))
```

### 2. 代码分割

使用动态导入：

```tsx
import dynamic from 'next/dynamic'

const LinkExchange = dynamic(
  () => import('@link-exchange/react').then(mod => mod.LinkExchange),
  {
    loading: () => <div>Loading badges...</div>,
    ssr: false
  }
)
```

### 3. 缓存策略

合理的缓存配置：

```javascript
const cacheConfig = {
  // 开发环境：短缓存，便于调试
  development: {
    enabled: true,
    ttlMs: 1 * 60 * 1000 // 1 分钟
  },

  // 生产环境：长缓存，提升性能
  production: {
    enabled: true,
    ttlMs: 60 * 60 * 1000 // 1 小时
  }
}
```

### 4. 资源预加载

在 HTML 头部预加载关键资源：

```html
<head>
  <!-- 预连接到 CDN -->
  <link rel="preconnect" href="https://cdn.example.com">

  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="https://cdn.example.com">

  <!-- 预加载配置 -->
  <link rel="preload" href="https://cdn.example.com/badges.json" as="fetch">

  <!-- 预加载图片 -->
  <link rel="preload" as="image" href="https://img.shields.io/badge/GitHub-100000?logo=github">
</head>
```

## 安全实践

### 1. 环境变量

使用环境变量管理敏感配置：

```bash
# .env.development
NEXT_PUBLIC_BADGES_URL=http://localhost:8080/badges.json
NEXT_PUBLIC_SITE_ID=my-app-dev

# .env.production
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
NEXT_PUBLIC_SITE_ID=my-app
```

### 2. 安全白名单

生产环境必须配置白名单：

```typescript
function getSecurityConfig() {
  if (process.env.NODE_ENV === 'production') {
    return {
      allowedLinkDomains: [
        'github.com',
        'npmjs.com',
        'vercel.com'
      ],
      allowedImageDomains: [
        'img.shields.io',
        'github.com',
        'npmjs.com'
      ]
    }
  }
  return {}
}
```

### 3. CSP 配置

配置内容安全策略：

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.example.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://cdn.example.com;
`
```

## 错误处理

### 1. 优雅降级

使用快照配置作为 fallback：

```javascript
const FALLBACK_CONFIG = {
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

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
    snapshot: FALLBACK_CONFIG,
    silent: false
  }
})
```

### 2. 错误边界

React 中使用错误边界：

```tsx
class BadgesErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>徽章暂时无法显示</div>
    }
    return this.props.children
  }
}
```

## 监控与分析

### 1. 遥测集成

集成分析平台：

```typescript
import { analytics } from '@/lib/analytics'

function setupTelemetry() {
  return {
    enabled: process.env.NODE_ENV === 'production',
    onEvent: (event: SDKEvent) => {
      // 发送到分析平台
      analytics.track(event.type, event)

      // 错误事件发送到 Sentry
      if (event.type.includes('failed') || event.type.includes('error')) {
        Sentry.captureException(new Error(event.type), {
          tags: { component: 'badges' },
          extra: event
        })
      }
    }
  }
}
```

### 2. 性能监控

监控关键指标：

```typescript
function trackPerformance() {
  const startTime = performance.now()

  return {
    enabled: true,
    onEvent: (event: SDKEvent) => {
      if (event.type === 'render_success') {
        const duration = performance.now() - startTime

        // 发送到性能监控
        if (window.gtag) {
          gtag('event', 'timing_complete', {
            name: 'badge_render',
            value: Math.round(duration)
          })
        }
      }
    }
  }
}
```

## 测试

### 1. 单元测试

编写单元测试：

```tsx
import { render, screen } from '@testing-library/react'
import { BadgesSection } from './BadgesSection'

describe('BadgesSection', () => {
  it('renders without crashing', () => {
    render(<BadgesSection group="partners" />)
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('passes correct props', () => {
    render(<BadgesSection group="technologies" />)
    // 验证 props 传递
  })
})
```

### 2. 集成测试

测试完整流程：

```typescript
import { mount } from '@link-exchange/core'

describe('Badge Integration', () => {
  it('loads and renders badges', async () => {
    const result = await mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })

    expect(result).toBeDefined()
    expect(result.unmount).toBeInstanceOf(Function)

    result.unmount()
  })
})
```

## 文档

### 1. 代码注释

编写清晰的注释：

```typescript
/**
 * 徽章配置
 *
 * @example
 * ```tsx
 * <BadgesSection group="partners" />
 * ```
 */
export function BadgesSection({ group }: Props) {
  // ...
}
```

### 2. README

维护项目文档：

```markdown
# My Project

## 徽章配置

本项目使用 Link Exchange Badges 展示合作伙伴徽章。

### 配置

详见 `config/badges.ts`

### 使用

\`\`\`tsx
import { BadgesSection } from '@/components/BadgesSection'

<BadgesSection group="partners" />
\`\`\`
```

## 版本管理

### 1. 配置版本控制

使用版本号管理配置：

```
https://cdn.example.com/badges.v1.json
https://cdn.example.com/badges.v2.json
```

### 2. 渐进式更新

逐步推出新配置：

```typescript
const configVersion = Math.random() < 0.1 ? 'v2' : 'v1'

LinkExchange.mount('#badges', {
  source: `https://cdn.example.com/badges.${configVersion}.json`
})
```

## 可访问性

### 1. 语义化 HTML

使用正确的 HTML 标签：

```tsx
<LinkExchange
  as="footer"
  source="https://cdn.example.com/badges.json"
/>
```

### 2. 替代文本

确保所有徽章都有 alt 文本：

```json
{
  "badges": [
    {
      "alt": "GitHub - 代码托管平台"
    }
  ]
}
```

### 3. 键盘导航

支持键盘导航：

```css
.badge-link:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

## 部署

### 1. 环境检查

部署前检查配置：

```typescript
function validateProductionConfig() {
  const config = getBadgesConfig()

  if (process.env.NODE_ENV === 'production') {
    if (!config.security) {
      throw new Error('安全白名单未配置')
    }

    if (!config.telemetry?.enabled) {
      console.warn('生产环境建议启用遥测')
    }
  }

  return config
}
```

### 2. CI/CD

在 CI/CD 中验证：

```yaml
# .github/workflows/deploy.yml
- name: Validate badges config
  run: |
    npm run validate-badges-config
```

## 总结

### 关键原则

1. **性能优先**：合理使用缓存、懒加载、代码分割
2. **安全第一**：配置白名单、使用 HTTPS、验证输入
3. **错误容忍**：优雅降级、错误边界、重试机制
4. **监控完善**：遥测追踪、性能监控、错误上报
5. **测试充分**：单元测试、集成测试、端到端测试
6. **文档清晰**：代码注释、README、API 文档

### 检查清单

部署前确认：

- [ ] 配置 URL 使用 HTTPS
- [ ] 安全白名单已配置
- [ ] 缓存策略已优化
- [ ] 遥测已集成
- [ ] 错误处理已完善
- [ ] 测试已通过
- [ ] 文档已更新

## 下一步

- [遥测与分析](/advanced/telemetry)
- [安全性](/advanced/security)
- [故障排查](/advanced/troubleshooting)
