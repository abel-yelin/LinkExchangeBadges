# 故障排查

本节介绍常见问题和解决方案。

## 徽章不显示

### 问题：页面上没有徽章显示

#### 可能原因 1：配置 URL 错误

检查配置 URL 是否正确：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'config_fetch_failed') {
        console.error('配置加载失败:', event.error)
      }
    }
  }
})
```

**解决方案：**
1. 验证 URL 是否可访问
2. 检查网络连接
3. 确认服务器是否运行

#### 可能原因 2：配置格式错误

检查配置格式是否正确：

```json
{
  "configVersion": "1",
  "schemaVersion": "1.0.0",
  "updatedAt": "2024-01-01T00:00:00Z",
  "badges": [
    {
      "id": "github",
      "name": "GitHub",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/GitHub-100000?logo=github",
      "linkUrl": "https://github.com"
    }
  ]
}
```

**解决方案：**
1. 使用 JSON 验证工具检查格式
2. 确认所有必需字段都存在
3. 检查字段类型是否正确

#### 可能原因 3：容器元素未找到

检查容器元素是否存在：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'target_not_found') {
        console.error('容器未找到:', event.selector)
      }
    }
  }
})
```

**解决方案：**
1. 确认选择器正确
2. 等待 DOM 加载完成
3. 检查元素 ID 是否重复

#### 可能原因 4：所有徽章都被禁用

检查徽章是否启用：

```json
{
  "badges": [
    {
      "enabled": true  // 必须为 true
    }
  ]
}
```

**解决方案：**
1. 设置 `enabled: true`
2. 检查规则是否过滤了所有徽章

## 配置加载失败

### 问题：无法获取远程配置

#### 可能原因 1：CORS 错误

检查控制台是否有 CORS 错误：

```
Access to fetch at 'https://cdn.example.com/badges.json' from origin 'https://yourwebsite.com' has been blocked by CORS policy
```

**解决方案：**

服务器端配置：

```javascript
// Express.js
app.get('/badges.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(config)
})
```

#### 可能原因 2：网络超时

增加超时时间：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fetchTimeoutMs: 10000 // 增加到 10 秒
})
```

#### 可能原因 3：HTTPS 混合内容

检查是否在 HTTPS 页面加载 HTTP 资源：

**解决方案：**
1. 使用 HTTPS 的配置 URL
2. 确保所有资源都使用 HTTPS

## 缓存问题

### 问题：配置更新后未生效

#### 可能原因 1：缓存未过期

检查缓存状态：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'cache_hit') {
        console.log('使用缓存:', event.configVersion)
      }
    }
  }
})
```

**解决方案：**

方法 1：缩短缓存时间

```javascript
cache: {
  enabled: true,
  ttlMs: 5 * 60 * 1000 // 5 分钟
}
```

方法 2：清除缓存

```javascript
localStorage.removeItem('link-exchange-cache')
location.reload()
```

方法 3：使用版本号

```
https://cdn.example.com/badges.v2.json
```

### 问题：缓存不工作

检查浏览器是否支持 localStorage：

```javascript
function checkLocalStorage() {
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    return true
  } catch (e) {
    console.error('localStorage not available:', e)
    return false
  }
}

if (!checkLocalStorage()) {
  console.warn('缓存不可用，将每次重新加载配置')
}
```

## 样式问题

### 问题：徽章样式不正确

#### 可能原因 1：CSS 冲突

使用 CSS 隔离：

```css
/* 使用特定的类名 */
.badges-container {
  display: flex;
  gap: 15px;
}

.badges-container a {
  text-decoration: none;
}

.badges-container img {
  display: block;
}
```

#### 可能原因 2：响应式布局问题

使用媒体查询：

```css
@media (max-width: 768px) {
  .badges-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

## React 特定问题

### 问题：React 组件不渲染

#### 可能原因 1：缺少 'use client'

Next.js App Router 中需要使用客户端组件：

```tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
    />
  )
}
```

#### 可能原因 2：React 版本不兼容

检查 React 版本：

```bash
npm list react
```

确保 React 版本 >= 18.0.0。

#### 可能原因 3：SSR 问题

SDK 依赖浏览器 API，需要客户端渲染：

```tsx
'use client'

import { useEffect, useState } from 'react'
import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
    />
  )
}
```

## 性能问题

### 问题：页面加载缓慢

#### 解决方案 1：延迟加载

```javascript
// 等待页面加载完成
window.addEventListener('load', () => {
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json'
  })
})
```

#### 解决方案 2：使用 Intersection Observer

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      LinkExchange.mount('#badges', {
        source: 'https://cdn.example.com/badges.json'
      })
      observer.unobserve(entry.target)
    }
  })
})

observer.observe(document.querySelector('#badges'))
```

#### 解决方案 3：预加载资源

```html
<head>
  <link rel="preconnect" href="https://cdn.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
  <link rel="preload" as="image" href="https://img.shields.io/badge/GitHub-100000?logo=github">
</head>
```

## 错误处理

### 启用详细日志

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      console.log(`[Badges ${event.type}]`, event)

      // 高亮错误
      if (event.type.includes('failed') || event.type.includes('error')) {
        console.error(`[Badges Error]`, event)
      }
    }
  }
})
```

### 使用快照配置

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
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
  }
})
```

## 调试工具

### 浏览器控制台

使用浏览器开发者工具：

1. 打开控制台（F12）
2. 查看 Console 标签页的错误
3. 查看 Network 标签页的请求
4. 查看 Application 标签页的 localStorage

### React DevTools

如果使用 React，安装 React DevTools：

```bash
npm install --save-dev @welldone-software/why-did-you-render
```

### 性能分析

```javascript
// 记录性能
const startTime = performance.now()

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'render_success') {
        const duration = performance.now() - startTime
        console.log(`渲染耗时: ${duration.toFixed(2)}ms`)
      }
    }
  }
})
```

## 常见错误信息

### TargetNotFoundError

```
Error: Target element not found: "#badges"
```

**原因：** 容器元素不存在

**解决：** 检查选择器和 DOM 结构

### ConfigFetchError

```
Error: Failed to fetch config: https://cdn.example.com/badges.json
```

**原因：** 无法获取配置

**解决：** 检查 URL、网络、CORS

### ConfigValidationError

```
Error: Config validation failed: ...
```

**原因：** 配置格式错误

**解决：** 检查 JSON 格式和必需字段

### RenderError

```
Error: Failed to render badge: github
```

**原因：** 渲染失败

**解决：** 检查徽章数据和环境

## 获取帮助

### 1. 检查文档

- [快速开始](/guide/getting-started)
- [API 参考](/api/core)
- [常见问题](https://github.com/yourusername/link-exchange-badges/issues)

### 2. 搜索问题

在 GitHub Issues 中搜索类似问题：

```
site:github.com/yourusername/link-exchange-badges badges not showing
```

### 3. 提交问题

如果问题仍未解决，请提交 Issue：

```markdown
## 环境信息
- SDK 版本:
- 浏览器版本:
- Node.js 版本:

## 问题描述
...

## 复现步骤
1. ...
2. ...

## 期望行为
...

## 实际行为
...

## 代码示例
\`\`\`javascript
...
\`\`\`

## 错误信息
\`\`\`
...
\`\`\`
```

### 4. 联系支持

- Email: support@example.com
- Discord: https://discord.gg/example
- Twitter: @linkexchange

## 下一步

- [遥测与分析](/advanced/telemetry)
- [安全性](/advanced/security)
- [最佳实践](/advanced/best-practices)
