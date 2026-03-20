---
layout: home

hero:
  name: Link Exchange Badges
  text: 跨栈徽章展示 SDK
  tagline: 在任何 Web 应用中轻松展示合作伙伴徽章
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 API
      link: /api/core
    - theme: alt
      text: GitHub
      link: https://github.com/yourusername/link-exchange-badges

features:
  - icon: ⚡️
    title: 极简集成
    details: 只需几行代码，即可在 HTML、React、Next.js 等任何框架中集成徽章展示功能。
  - icon: 🎯
    title: 类型安全
    details: 完整的 TypeScript 支持，提供准确的类型定义和智能提示。
  - icon: 🔄
    title: 远程配置
    details: 通过远程 JSON 配置动态控制徽章展示，无需重新部署应用。
  - icon: 🛡️
    title: 安全可靠
    details: 内置安全白名单、配置验证和错误处理，确保生产环境稳定运行。
  - icon: 📊
    title: 遥测分析
    details: 内置事件追踪系统，可集成任意分析平台监控徽章性能。
  - icon: 💾
    title: 智能缓存
    details: 自动缓存远程配置，减少网络请求，提升加载性能。

---

## 快速预览

### HTML 使用

```html
<!-- 引入 SDK -->
<script src="https://cdn.example.com/link-exchange.js"></script>

<!-- 挂载徽章 -->
<footer id="badges"></footer>

<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json'
  })
</script>
```

### React 使用

```jsx
import { LinkExchange } from '@link-exchange/react'

function Footer() {
  return (
    <LinkExchange
      source="https://cdn.example.com/badges.json"
      siteId="my-site"
      environment="production"
    />
  )
}
```

## 核心特性

### 🎨 灵活的渲染系统

支持图片徽章，未来将扩展 HTML、SVG 等多种渲染类型。每个徽章可配置：

- 自定义尺寸和样式
- 链接目标和关系属性
- 显示规则（站点、环境、语言）

### 🌐 多环境支持

通过 `environment` 参数控制不同环境的徽章展示：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  environment: 'production' // development | staging | production
})
```

### 🔒 安全白名单

生产环境推荐配置域名白名单，防止配置被篡改：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: ['github.com', 'npmjs.com'],
    allowedImageDomains: ['img.shields.io', 'github.com']
  }
})
```

### 📡 内置遥测

追踪所有关键事件，集成监控平台：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 发送到你的分析平台
      analytics.track(event.type, event)
    }
  }
})
```

## 为什么选择 Link Exchange Badges？

### 传统方式的痛点

1. **硬编码徽章**：每次更新都需要重新部署应用
2. **缺乏灵活性**：无法根据环境动态调整徽章
3. **类型不安全**：配置错误只能在运行时发现
4. **缺少监控**：无法追踪徽章展示和点击数据

### 我们的解决方案

1. **远程配置**：通过 JSON 配置实时更新徽章
2. **规则引擎**：支持站点、环境、语言等多维度规则
3. **类型安全**：完整的 TypeScript 类型定义
4. **事件追踪**：内置遥测系统，集成任意分析平台

## 下一步

- [阅读快速开始指南](/guide/getting-started)
- [查看 API 参考](/api/core)
- [浏览完整示例](/examples/html)
- [了解最佳实践](/advanced/best-practices)
