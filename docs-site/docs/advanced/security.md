# 安全性

本节介绍 Link Exchange Badges SDK 的安全特性和最佳实践。

## 安全白名单

### 链接域名白名单

限制徽章链接只能跳转到指定域名：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: [
      'github.com',
      'npmjs.com',
      'typescriptlang.org',
      'opensource.org'
    ]
  }
})
```

### 图片域名白名单

限制徽章图片只能从指定域名加载：

```javascript
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

## 配置验证

### Schema 版本控制

SDK 会验证配置的 schema 版本：

```json
{
  "schemaVersion": "1.0.0",
  "configVersion": "1",
  "updatedAt": "2024-01-01T00:00:00Z",
  "badges": [...]
}
```

如果 `schemaVersion` 不是 SDK 支持的版本，会使用快照配置。

### 配置完整性验证

SDK 使用 Zod 进行运行时验证：

```typescript
import { validateConfig } from '@link-exchange/core'

try {
  const config = validateConfig(rawConfig)
  console.log('配置有效')
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('配置无效:', error.errors)
  }
}
```

## HTTPS 要求

### 强制 HTTPS

生产环境应使用 HTTPS：

```javascript
const isProduction = process.env.NODE_ENV === 'production'

const config = {
  source: isProduction
    ? 'https://cdn.example.com/badges.json'
    : 'http://localhost:8080/badges.json'
}

LinkExchange.mount('#badges', config)
```

### 混合内容防护

现代浏览器会阻止混合内容（HTTPS 页面加载 HTTP 资源）。

## CORS 配置

### 服务器端配置

确保配置服务器正确设置 CORS 头：

```javascript
// Express.js 示例
app.get('/badges.json', (req, res) => {
  // 只允许可信域名
  const allowedOrigins = [
    'https://yourwebsite.com',
    'https://www.yourwebsite.com'
  ]

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  // 其他 CORS 头
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')

  res.json(badgesConfig)
})
```

### 预检请求

```javascript
app.options('/badges.json', (req, res) => {
  const allowedOrigins = ['https://yourwebsite.com']
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
  }

  res.sendStatus(204)
})
```

## CSP (Content Security Policy)

### 配置 CSP 头

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  img-src 'self' https://img.shields.io https://github.com;
  connect-src 'self' https://cdn.example.com;
  frame-src 'none';
  object-src 'none';
```

### 使用 nonce

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' 'nonce-{RANDOM}' https://cdn.example.com"
>

<script nonce="{RANDOM}" src="https://cdn.example.com/link-exchange.js"></script>
```

### React 中的 CSP

```jsx
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  connect-src 'self' https://cdn.example.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}
```

## 输入净化

### 防止 XSS

SDK 会自动净化用户输入：

```javascript
// SDK 内部使用 textContent 而不是 innerHTML
// 防止 XSS 攻击
element.textContent = badge.alt
```

### 自定义净化

```javascript
import DOMPurify from 'dompurify'

function sanitizeBadge(badge) {
  return {
    ...badge,
    name: DOMPurify.sanitize(badge.name),
    alt: DOMPurify.sanitize(badge.alt || '')
  }
}
```

## 数据完整性

### 使用 Subresource Integrity (SRI)

```html
<script
  src="https://cdn.example.com/link-exchange.js"
  integrity="sha384-{HASH}"
  crossorigin="anonymous"
></script>
```

### 生成 SRI 哈希

```bash
# 生成 SHA-384 哈希
cat link-exchange.js | openssl dgst -sha384 -binary | openssl base64 -A
```

## 错误处理

### 安全的错误处理

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
    silent: true, // 生产环境不暴露错误信息
    snapshot: {
      // 使用安全的快照配置
      configVersion: '1',
      schemaVersion: '1.0.0',
      updatedAt: new Date().toISOString(),
      badges: []
    }
  },
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 只发送必要的错误信息
      if (event.type === 'render_failed') {
        // 不发送敏感信息
        const safeError = {
          type: event.type,
          message: 'Badge render failed'
        }
        sendToMonitoring(safeError)
      }
    }
  }
})
```

## 环境隔离

### 配置隔离

```javascript
const configs = {
  development: {
    source: 'http://localhost:8080/badges.json',
    security: {} // 开发环境不启用严格安全
  },
  staging: {
    source: 'https://staging-cdn.example.com/badges.json',
    security: {
      allowedLinkDomains: ['github.com'],
      allowedImageDomains: ['img.shields.io']
    }
  },
  production: {
    source: 'https://cdn.example.com/badges.json',
    security: {
      allowedLinkDomains: ['github.com', 'npmjs.com'],
      allowedImageDomains: ['img.shields.io', 'github.com']
    }
  }
}

const environment = process.env.NODE_ENV || 'development'
LinkExchange.mount('#badges', configs[environment])
```

## 日志安全

### 避免记录敏感信息

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 移除可能包含敏感信息的字段
      const safeEvent = { ...event }
      if (safeEvent.source) {
        // 只保留域名
        const url = new URL(safeEvent.source)
        safeEvent.source = url.hostname
      }

      console.log('[Badges]', safeEvent)
    }
  }
})
```

## 安全审计

### 定期审计配置

```javascript
function auditConfig(config) {
  const issues = []

  // 检查是否有 HTTP 链接
  config.badges.forEach(badge => {
    if (badge.linkUrl.startsWith('http:')) {
      issues.push(`Badge ${badge.id} uses HTTP link`)
    }
    if (badge.imageUrl.startsWith('http:')) {
      issues.push(`Badge ${badge.id} uses HTTP image`)
    }
  })

  return issues
}
```

### 监控异常事件

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 监控可疑事件
      if (event.type === 'badge_click') {
        const url = new URL(event.linkUrl)

        // 检查是否跳转到白名单外的域名
        const allowedDomains = ['github.com', 'npmjs.com']
        if (!allowedDomains.includes(url.hostname)) {
          // 记录可疑点击
          sendAlert({
            type: 'suspicious_click',
            badgeId: event.badgeId,
            domain: url.hostname
          })
        }
      }
    }
  }
})
```

## 依赖安全

### 定期更新依赖

```bash
# 检查依赖漏洞
npm audit

# 自动修复
npm audit fix

# 更新到最新版本
npm update @link-exchange/react @link-exchange/core
```

### 使用 npm audit

```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=high",
    "audit:fix": "npm audit fix"
  }
}
```

## 最佳实践

### 1. 生产环境检查清单

```javascript
function validateProductionConfig(config) {
  const errors = []

  // 检查是否使用 HTTPS
  if (!config.source.startsWith('https://')) {
    errors.push('Source must use HTTPS in production')
  }

  // 检查是否配置了安全白名单
  if (!config.security) {
    errors.push('Security whitelist not configured')
  } else {
    if (!config.security.allowedLinkDomains) {
      errors.push('Link domains whitelist not configured')
    }
    if (!config.security.allowedImageDomains) {
      errors.push('Image domains whitelist not configured')
    }
  }

  // 检查是否启用了遥测
  if (!config.telemetry?.enabled) {
    errors.push('Telemetry should be enabled in production')
  }

  return errors
}

// 使用
const config = {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: ['github.com'],
    allowedImageDomains: ['img.shields.io']
  },
  telemetry: { enabled: true }
}

const errors = validateProductionConfig(config)
if (errors.length > 0) {
  console.error('Config validation failed:', errors)
}
```

### 2. 安全的配置加载

```javascript
async function loadConfigSecurely(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'omit' // 不发送凭证
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const config = await response.json()

    // 验证配置
    return validateConfig(config)
  } catch (error) {
    console.error('Failed to load config:', error)
    throw error
  }
}
```

### 3. 安全的默认值

```javascript
const DEFAULT_SECURITY_CONFIG = {
  allowedLinkDomains: [],
  allowedImageDomains: []
}

function getSecurityConfig(userConfig) {
  return {
    ...DEFAULT_SECURITY_CONFIG,
    ...userConfig?.security
  }
}

// 使用
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: getSecurityConfig(userConfig)
})
```

## 下一步

- [遥测与分析](/advanced/telemetry)
- [故障排查](/advanced/troubleshooting)
- [最佳实践](/advanced/best-practices)
