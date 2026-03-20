# 配置

本节详细说明 Link Exchange Badges SDK 的配置选项。

## MountOptions 完整选项

### source (必填)

远程配置的 URL，必须是有效的 HTTPS 地址。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json'
})
```

### siteId (可选)

站点标识，用于徽章规则匹配。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-website'
})
```

### group (可选)

只渲染指定分组的徽章。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  group: 'partners' // 只显示 partners 分组的徽章
})
```

### environment (可选)

运行环境，用于环境规则匹配。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  environment: 'production' // 'development' | 'staging' | 'production'
})
```

### locale (可选)

语言标识，用于语言规则匹配。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  locale: 'zh-CN' // BCP 47 语言标签
})
```

### className (可选)

容器元素的 CSS 类名。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  className: 'my-custom-class'
})
```

## 缓存配置

### enabled

是否启用缓存，默认为 `true`。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true
  }
})
```

### ttlMs

缓存有效期（毫秒），默认 30 分钟。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true,
    ttlMs: 5 * 60 * 1000 // 5 分钟
  }
})
```

## Fallback 配置

### snapshot

内置的快照配置，在远程配置失败时使用。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
    snapshot: {
      configVersion: '1',
      schemaVersion: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
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
  }
})
```

### silent

是否静默处理所有错误，默认为 `false`。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
    silent: true // 不输出任何警告信息
  }
})
```

## 安全配置

### allowedLinkDomains

允许的链接域名白名单。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: [
      'github.com',
      'npmjs.com',
      'typescriptlang.org'
    ]
  }
})
```

### allowedImageDomains

允许的图片域名白名单。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedImageDomains: [
      'img.shields.io',
      'github.com',
      'npmjs.com'
    ]
  }
})
```

## 遥测配置

### enabled

是否启用遥测，默认为 `true`。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true
  }
})
```

### onEvent

事件回调函数，用于自定义事件处理。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 发送到分析平台
      analytics.track(event.type, event)

      // 或发送到自己的服务器
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(event)
      })
    }
  }
})
```

## 网络配置

### fetchTimeoutMs

请求超时时间（毫秒），默认 5000ms。

```typescript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fetchTimeoutMs: 10000 // 10 秒
})
```

## 完整配置示例

```typescript
LinkExchange.mount('#badges', {
  // 基础配置
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-website',
  group: 'partners',
  environment: 'production',
  locale: 'zh-CN',
  className: 'partner-badges',

  // 缓存配置
  cache: {
    enabled: true,
    ttlMs: 30 * 60 * 1000 // 30 分钟
  },

  // Fallback 配置
  fallback: {
    snapshot: {
      configVersion: '1',
      schemaVersion: '1.0.0',
      updatedAt: '2024-01-01T00:00:00Z',
      badges: []
    },
    silent: false
  },

  // 安全配置
  security: {
    allowedLinkDomains: ['github.com', 'npmjs.com'],
    allowedImageDomains: ['img.shields.io', 'github.com']
  },

  // 遥测配置
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      console.log('[Telemetry]', event.type, event)
    }
  },

  // 网络配置
  fetchTimeoutMs: 5000
})
```

## React 组件配置

React 组件支持相同的配置选项：

```jsx
<LinkExchange
  source="https://cdn.example.com/badges.json"
  siteId="my-react-app"
  environment="production"
  cache={{ enabled: true, ttlMs: 1800000 }}
  telemetry={{
    enabled: true,
    onEvent: (event) => console.log(event)
  }}
/>
```

## 环境变量最佳实践

使用环境变量管理配置：

```typescript
// config.ts
export const badgesConfig = {
  source: process.env.NEXT_PUBLIC_BADGES_URL,
  siteId: process.env.NEXT_PUBLIC_SITE_ID,
  environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
  locale: process.env.NEXT_PUBLIC_LOCALE
}

// 使用
LinkExchange.mount('#badges', badgesConfig)
```

## 配置验证

SDK 会在运行时验证配置：

- `source` 必须是有效的 URL
- `cache.ttlMs` 必须是正数
- `security.*Domains` 必须是有效的域名数组
- `telemetry.onEvent` 必须是函数

验证失败会抛出 `ConfigValidationError`。

## 下一步

- [徽章规则](/guide/badge-rules)
- [缓存策略](/guide/caching)
- [API 参考](/api/core)
