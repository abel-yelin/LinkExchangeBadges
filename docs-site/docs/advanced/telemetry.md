# 遥测与分析

Link Exchange Badges SDK 内置了完整的遥测系统，让你能够监控徽章的所有关键事件。

## 启用遥测

### 基础配置

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true
  }
})
```

### 事件回调

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      console.log('Badge event:', event.type, event)
    }
  }
})
```

## 事件类型

### 配置事件

#### config_fetch_start

开始获取配置时触发。

```typescript
{
  type: 'config_fetch_start',
  source: string  // 配置 URL
}
```

#### config_fetch_success

配置获取成功时触发。

```typescript
{
  type: 'config_fetch_success',
  source: string,
  configVersion: string  // 配置版本号
}
```

#### config_fetch_failed

配置获取失败时触发。

```typescript
{
  type: 'config_fetch_failed',
  source: string,
  error: string  // 错误信息
}
```

#### config_validate_failed

配置验证失败时触发。

```typescript
{
  type: 'config_validate_failed',
  source: string,
  error: string
}
```

### 缓存事件

#### cache_hit

缓存命中时触发。

```typescript
{
  type: 'cache_hit',
  key: string,
  configVersion: string
}
```

#### cache_miss

缓存未命中时触发。

```typescript
{
  type: 'cache_miss',
  key: string
}
```

#### cache_stale_used

使用过期缓存时触发（网络请求失败后的 fallback）。

```typescript
{
  type: 'cache_stale_used',
  key: string,
  configVersion: string
}
```

### 渲染事件

#### render_success

渲染成功时触发。

```typescript
{
  type: 'render_success',
  count: number  // 渲染的徽章数量
}
```

#### render_empty

渲染结果为空时触发。

```typescript
{
  type: 'render_empty'
}
```

#### render_failed

渲染失败时触发。

```typescript
{
  type: 'render_failed',
  error: string
}
```

### 用户交互事件

#### badge_click

用户点击徽章时触发。

```typescript
{
  type: 'badge_click',
  badgeId: string,
  linkUrl: string
}
```

### 系统事件

#### target_not_found

目标容器未找到时触发。

```typescript
{
  type: 'target_not_found',
  selector: string
}
```

#### fallback_snapshot_used

使用快照配置时触发。

```typescript
{
  type: 'fallback_snapshot_used'
}
```

#### sdk_init

SDK 初始化时触发。

```typescript
{
  type: 'sdk_init',
  source: string,
  siteId?: string
}
```

## 集成分析平台

### Google Analytics 4

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (window.gtag) {
        gtag('event', event.type, {
          event_category: 'link_exchange_badges',
          event_label: event.type,
          ...event
        })
      }
    }
  }
})
```

### Segment

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (window.analytics) {
        analytics.track(event.type, event)
      }
    }
  }
})
```

### Amplitude

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (window.amplitude) {
        amplitude.getInstance().logEvent(event.type, event)
      }
    }
  }
})
```

### Mixpanel

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (window.mixpanel) {
        mixpanel.track(event.type, event)
      }
    }
  }
})
```

### 自定义分析

```javascript
class BadgesAnalytics {
  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }

  async sendEvent(event) {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }
}

const analytics = new BadgesAnalytics('/api/analytics')

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => analytics.sendEvent(event)
  }
})
```

## React 中的遥测

```jsx
import { useEffect } from 'react'
import { LinkExchange } from '@link-exchange/react'

function BadgesWithAnalytics() {
  useEffect(() => {
    const handleEvent = (event) => {
      // 发送到分析平台
      if (window.analytics) {
        window.analytics.track(event.type, event)
      }

      // 发送到自己的服务器
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    }

    // 设置全局事件处理器
    window.badgesEventHandler = handleEvent

    return () => {
      delete window.badgesEventHandler
    }
  }, [])

  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          if (window.badgesEventHandler) {
            window.badgesEventHandler(event)
          }
        }
      }}
    />
  )
}
```

## 事件过滤

### 只记录特定事件

```javascript
const INTERESTING_EVENTS = new Set([
  'badge_click',
  'render_success',
  'config_fetch_failed'
])

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (INTERESTING_EVENTS.has(event.type)) {
        console.log('Important event:', event)
      }
    }
  }
})
```

### 基于环境过滤

```javascript
const isProduction = process.env.NODE_ENV === 'production'

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 生产环境发送到分析平台
      if (isProduction) {
        analytics.track(event.type, event)
      }
      // 开发环境打印到控制台
      else {
        console.log('[Dev]', event.type, event)
      }
    }
  }
})
```

## 性能监控

### 监控配置加载时间

```javascript
const loadTimes = new Map()

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'config_fetch_start') {
        loadTimes.set(event.source, Date.now())
      } else if (event.type === 'config_fetch_success') {
        const startTime = loadTimes.get(event.source)
        if (startTime) {
          const duration = Date.now() - startTime
          console.log(`Config loaded in ${duration}ms`)

          // 发送到性能监控
          if (window.performanceObserver) {
            performanceObserver.mark('badge-config-loaded', {
              detail: { duration }
            })
          }
        }
      }
    }
  }
})
```

### 监控渲染性能

```javascript
let renderStartTime

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'render_success') {
        if (renderStartTime) {
          const duration = performance.now() - renderStartTime
          console.log(`Rendered ${event.count} badges in ${duration.toFixed(2)}ms`)

          // 发送到性能监控
          if (window.gtag) {
            gtag('event', 'timing_complete', {
              name: 'badge_render',
              value: Math.round(duration)
            })
          }
        }
      } else if (event.type === 'config_fetch_success') {
        renderStartTime = performance.now()
      }
    }
  }
})
```

## 错误追踪

### Sentry 集成

```javascript
import * as Sentry from '@sentry/browser'

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'config_fetch_failed') {
        Sentry.captureException(new Error(event.error), {
          tags: {
            component: 'link_exchange_badges',
            event: 'config_fetch_failed'
          },
          extra: {
            source: event.source
          }
        })
      } else if (event.type === 'render_failed') {
        Sentry.captureException(new Error(event.error), {
          tags: {
            component: 'link_exchange_badges',
            event: 'render_failed'
          }
        })
      }
    }
  }
})
```

## 用户行为分析

### 追踪徽章点击

```javascript
const badgeClicks = new Map()

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'badge_click') {
        const count = badgeClicks.get(event.badgeId) || 0
        badgeClicks.set(event.badgeId, count + 1)

        console.log(`Badge ${event.badgeId} clicked ${count + 1} times`)

        // 发送到分析平台
        if (window.analytics) {
          analytics.track('Badge Clicked', {
            badgeId: event.badgeId,
            linkUrl: event.linkUrl,
            totalClicks: count + 1
          })
        }
      }
    }
  }
})
```

### 转化追踪

```javascript
let hasClickedBadge = false

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'badge_click' && !hasClickedBadge) {
        hasClickedBadge = true

        // 首次点击转化
        if (window.gtag) {
          gtag('event', 'conversion', {
            send_to: 'AW-CONVERSION_ID',
            value: 1.0,
            currency: 'USD'
          })
        }
      }
    }
  }
})
```

## 调试

### 启用详细日志

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      console.log(`[Badges ${new Date().toISOString()}]`, event.type, event)

      // 高亮重要事件
      if (event.type.includes('failed') || event.type.includes('error')) {
        console.warn(`[Badges Error]`, event)
      }
    }
  }
})
```

### 事件统计

```javascript
const eventStats = {}

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      eventStats[event.type] = (eventStats[event.type] || 0) + 1

      // 每分钟打印统计
      if (!eventStats._lastPrint || Date.now() - eventStats._lastPrint > 60000) {
        console.log('[Badges Stats]', { ...eventStats })
        eventStats._lastPrint = Date.now()
      }
    }
  }
})
```

## 最佳实践

### 1. 生产环境配置

```javascript
const TELEMETRY_CONFIG = {
  development: {
    enabled: true,
    onEvent: (event) => console.log('[Dev]', event.type)
  },
  production: {
    enabled: true,
    onEvent: (event) => {
      // 只发送关键事件
      if (['badge_click', 'render_failed'].includes(event.type)) {
        analytics.track(event.type, event)
      }
    }
  }
}

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: TELEMETRY_CONFIG[process.env.NODE_ENV]
})
```

### 2. 错误处理

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      try {
        analytics.track(event.type, event)
      } catch (error) {
        console.error('Failed to send telemetry:', error)
        // 不影响主应用
      }
    }
  }
})
```

### 3. 隐私保护

```javascript
function sanitizeEvent(event) {
  const sanitized = { ...event }

  // 移除敏感信息
  if (sanitized.source) {
    // 移除 URL 中的查询参数
    sanitized.source = sanitized.source.split('?')[0]
  }

  return sanitized
}

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      analytics.track(event.type, sanitizeEvent(event))
    }
  }
})
```

## 下一步

- [安全性](/advanced/security)
- [故障排查](/advanced/troubleshooting)
- [最佳实践](/advanced/best-practices)
