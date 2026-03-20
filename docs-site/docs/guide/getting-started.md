# 快速开始

本指南将帮助你在 5 分钟内集成 Link Exchange Badges SDK。

## 选择你的集成方式

根据你的技术栈选择合适的集成方式：

- **HTML**：使用 CDN 脚本，无需构建工具
- **React**：使用 React 组件，适合 React 应用
- **Next.js**：使用 React 组件，支持 SSR
- **其他框架**：使用核心 API 或 CDN 脚本

## HTML 集成

### 1. 引入 SDK

在 HTML 中添加 script 标签：

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <footer id="badges"></footer>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

### 2. 创建配置文件

创建 `badges.json`：

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

### 3. 运行

将 `badges.json` 部署到 CDN，然后在浏览器中打开 HTML 文件。

## React 集成

### 1. 安装包

```bash
npm install @link-exchange/react
# 或
pnpm add @link-exchange/react
# 或
yarn add @link-exchange/react
```

### 2. 使用组件

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

### 3. 高级用法

```jsx
import { LinkExchange } from '@link-exchange/react'

function Footer() {
  return (
    <footer>
      <LinkExchange
        source="https://cdn.example.com/badges.json"
        siteId="my-website"
        environment="production"
        locale="zh-CN"
        cache={{
          enabled: true,
          ttlMs: 30 * 60 * 1000 // 30 分钟
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

## Next.js 集成

### 1. 安装包

```bash
npm install @link-exchange/react
```

### 2. 创建客户端组件

由于 SDK 需要访问浏览器 API，需要使用 `'use client'`：

```jsx
// components/Badges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL}
      siteId="my-nextjs-app"
      environment={process.env.NODE_ENV}
    />
  )
}
```

### 3. 在页面中使用

```jsx
// app/page.tsx
import { Badges } from '@/components/Badges'

export default function Home() {
  return (
    <main>
      <h1>我的 Next.js 应用</h1>
      <Badges />
    </main>
  )
}
```

### 4. 环境变量

在 `.env.local` 中配置：

```env
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
```

## 验证集成

### 1. 检查控制台

打开浏览器控制台，你应该看到：

```
[LinkExchange] SDK initialized
[LinkExchange] Fetching config: https://cdn.example.com/badges.json
[LinkExchange] Config fetched successfully
[LinkExchange] Rendering 1 badge(s)
```

### 2. 检查渲染结果

在页面上应该能看到徽章显示。

### 3. 测试交互

点击徽章，应该能跳转到配置的链接。

## 常见问题

### Q: 徽章不显示？

检查以下几点：

1. 配置 URL 是否可访问
2. 配置格式是否正确
3. 浏览器控制台是否有错误
4. 徽章是否启用 (`enabled: true`)

### Q: 如何调试？

启用调试模式：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => console.log('[Debug]', event)
  }
})
```

### Q: 如何处理 CORS？

确保配置服务器设置了正确的 CORS 头：

```
Access-Control-Allow-Origin: *
# 或指定域名
Access-Control-Allow-Origin: https://yourwebsite.com
```

### Q: 如何更新徽章？

只需更新远程配置文件，SDK 会自动获取最新配置（受缓存 TTL 限制）。

## 下一步

- [配置选项](/guide/configuration)
- [徽章规则](/guide/badge-rules)
- [缓存策略](/guide/caching)
- [API 参考](/api/core)
