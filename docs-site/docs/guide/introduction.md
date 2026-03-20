# 介绍

Link Exchange Badges 是一个跨栈的徽章展示 SDK，让你能够在任何 Web 应用中轻松展示合作伙伴徽章。

## 什么是 Link Exchange Badges？

Link Exchange Badges 是一个轻量级、类型安全的 JavaScript SDK，用于在 Web 应用中动态展示徽章。它支持：

- **多框架支持**：原生 HTML、React、Next.js 等
- **远程配置**：通过 JSON 配置动态控制徽章
- **规则引擎**：支持站点、环境、语言等多维度规则
- **类型安全**：完整的 TypeScript 类型定义
- **遥测追踪**：内置事件追踪系统

## 设计理念

### 1. 简单优先

API 设计遵循"约定优于配置"的原则，最小可用配置只需一行代码：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json'
})
```

### 2. 类型安全

使用 Zod 进行运行时验证，TypeScript 提供编译时检查：

```typescript
import type { BadgeConfig, MountOptions } from '@link-exchange/core'

const options: MountOptions = {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-site',
  environment: 'production'
}
```

### 3. 渐进增强

从简单用例开始，逐步使用高级功能：

- **基础**：远程配置 + 缓存
- **进阶**：规则引擎 + 安全白名单
- **高级**：遥测追踪 + 自定义渲染

### 4. 错误容忍

SDK 内置完善的错误处理机制：

- 远程配置失败时使用缓存
- 缓存过期时仍可作为 fallback
- 所有错误都可静默处理，不影响主应用

## 架构概览

```
┌─────────────────┐
│   Web 应用      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Link Exchange  │
│     SDK         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ 远程   │ │ 本地缓存 │
│ 配置   │ │          │
└────────┘ └──────────┘
```

## 核心概念

### 1. 配置 (BadgeConfig)

远程配置对象，包含所有徽章的定义和元数据：

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

### 2. 挂载选项 (MountOptions)

SDK 的配置选项，控制徽章的获取和渲染行为：

```typescript
{
  source: string                    // 远程配置 URL
  siteId?: string                   // 站点标识
  group?: string                    // 徽章分组
  environment?: 'development' | 'staging' | 'production'
  locale?: string                   // 语言标识
  cache?: { enabled?: boolean; ttlMs?: number }
  security?: { allowedLinkDomains?: string[] }
  telemetry?: { enabled?: boolean; onEvent?: (event) => void }
}
```

### 3. 规则引擎

根据规则过滤徽章：

- **siteIds**：只在指定站点展示
- **environments**：只在指定环境展示
- **locales**：只在指定语言展示

### 4. 遥测事件

SDK 生命周期中的关键事件：

- `config_fetch_start`：开始获取配置
- `config_fetch_success`：配置获取成功
- `cache_hit`：缓存命中
- `render_success`：渲染成功
- `badge_click`：徽章点击

## 适用场景

### 1. 合作伙伴展示

在官网底部展示合作伙伴的 Logo 和链接：

```javascript
LinkExchange.mount('#partners', {
  source: 'https://cdn.example.com/partners.json',
  group: 'partners'
})
```

### 2. 技术栈展示

展示项目使用的技术栈：

```javascript
LinkExchange.mount('#tech-stack', {
  source: 'https://cdn.example.com/tech-stack.json',
  group: 'technologies'
})
```

### 3. 认证徽章

展示认证、奖项等徽章：

```javascript
LinkExchange.mount('#certifications', {
  source: 'https://cdn.example.com/certifications.json',
  environment: 'production' // 只在生产环境展示
})
```

## 技术栈

- **语言**：TypeScript 5.0+
- **构建**：tsup
- **验证**：Zod
- **测试**：Vitest
- **文档**：VitePress

## 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 许可证

MIT License - 详见 [LICENSE](https://github.com/yourusername/link-exchange-badges/blob/main/LICENSE)
