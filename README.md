# Link Exchange Badge Delivery SDK

> 跨技术栈的徽章交付 SDK - 通过远程 JSON 配置统一管理和展示合作伙伴徽章

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.0-red)](https://pnpm.io/)

## 📖 简介

Link Exchange SDK 是一个跨技术栈的徽章展示解决方案，让你能够在应用的 Footer 区域统一展示合作伙伴徽章（如 Product Hunt、Featured on 等）。**核心优势是徽章内容由远程 JSON 配置驱动**，接入方安装一次 SDK 后，徽章内容的更新无需重新打包或部署。

### ✨ 核心特性

- 🚀 **零更新部署** - 徽章内容变更无需发版
- 🎯 **多技术栈支持** - 提供 Vanilla JS、React、Next.js 适配器
- 🔒 **安全可靠** - 域名白名单、HTTPS 校验、内容过滤
- ⚡ **高性能** - 智能缓存、CDN 加速、懒加载图片
- 📊 **可观测** - 内置埋点事件，支持自定义监控接入
- 🎨 **灵活配置** - 支持按站点、环境、语言、分组过滤

### 📦 包结构

| 包名 | 说明 | 适用场景 |
|------|------|----------|
| `@link-exchange/core` | 核心 SDK | Vanilla JS、任何框架 |
| `@link-exchange/react` | React 适配器 | React 18+ 项目 |
| `@link-exchange/script` | CDN UMD 包 | HTML 页面直接引入 |

---

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm add @link-exchange/core

# 或使用 npm/yarn
npm install @link-exchange/core
yarn add @link-exchange/core
```

### React 项目

```bash
pnpm add @link-exchange/react
```

### Next.js 项目

```bash
pnpm add @link-exchange/react
```

---

## 📚 使用示例

### 1. Vanilla JS / HTML

**HTML 文件方式引入：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Link Exchange 示例</title>
</head>
<body>
  <footer id="badge-footer"></footer>

  <!-- 引入 SDK -->
  <script src="https://cdn.example.com/link-exchange.umd.cjs"></script>

  <script>
    window.LinkExchange.mount('#badge-footer', {
      source: 'https://cdn.example.com/badges.json',
      siteId: 'my-site',
      environment: 'production'
    });
  </script>
</body>
</html>
```

**NPM 包方式引入：**

```typescript
import { mount } from '@link-exchange/core'

mount('#badge-footer', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-site',
  environment: 'production'
})
```

### 2. React 项目

```tsx
import { LinkExchange } from '@link-exchange/react'

function App() {
  return (
    <div>
      <h1>我的网站</h1>
      {/* 其他内容 */}

      <LinkExchange
        source="https://cdn.example.com/badges.json"
        siteId="my-react-app"
        environment="production"
        as="footer"
      />
    </div>
  )
}
```

### 3. Next.js 14 (App Router)

```tsx
// app/components/Footer.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export default function Footer() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_SOURCE}
      siteId="my-nextjs-app"
      environment={process.env.NODE_ENV}
      as="footer"
      cache={{
        enabled: true,
        ttlMs: 30 * 60 * 1000 // 30 分钟
      }}
      security={{
        allowedLinkDomains: ['producthunt.com', 'example.com'],
        allowedImageDomains: ['cdn.example.com']
      }}
    />
  )
}
```

---

## ⚙️ 配置选项

### MountOptions 完整接口

```typescript
interface MountOptions {
  /** 配置源 URL（必填） */
  source: string

  /** 站点标识，用于 rules.siteIds 匹配 */
  siteId?: string

  /** 仅渲染指定分组的徽章 */
  group?: string

  /** 运行环境：development | staging | production */
  environment?: 'development' | 'staging' | 'production'

  /** 语言代码，如 zh-CN、en */
  locale?: string

  /** 容器元素的 CSS 类名 */
  className?: string

  /** 缓存配置 */
  cache?: {
    enabled?: boolean      // 默认 true
    ttlMs?: number        // 默认 30 分钟
  }

  /** 降级策略 */
  fallback?: {
    snapshot?: BadgeConfig  // 内置快照配置
    silent?: boolean        // 静默处理错误，默认 false
  }

  /** 安全配置 */
  security?: {
    allowedLinkDomains?: string[]    // 链接域名白名单
    allowedImageDomains?: string[]   // 图片域名白名单
  }

  /** 埋点配置 */
  telemetry?: {
    enabled?: boolean
    onEvent?: (event: SDKEvent) => void
  }

  /** 请求超时时间（毫秒），默认 5000 */
  fetchTimeoutMs?: number
}
```

### React 组件额外选项

```typescript
interface LinkExchangeProps extends MountOptions {
  /** 容器标签名，默认 'div' */
  as?: 'div' | 'footer' | 'section' | 'nav'
}
```

---

## 📋 配置文件格式

### badges.json 结构

```json
{
  "configVersion": "1",
  "schemaVersion": "1.0.0",
  "updatedAt": "2026-03-20T10:00:00Z",
  "badges": [
    {
      "id": "producthunt",
      "name": "Product Hunt",
      "enabled": true,
      "group": "featured",
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://producthunt.com/widgets/badges/featured.svg",
      "linkUrl": "https://producthunt.com/posts/your-product",
      "alt": "Featured on Product Hunt",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "width": 250,
      "height": 54,
      "rules": {
        "siteIds": ["marketing-site"],
        "environments": ["production"],
        "locales": ["en", "zh-CN"]
      }
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `configVersion` | string | ✅ | 配置版本号，每次发布递增 |
| `schemaVersion` | string | ✅ | Schema 版本，固定为 `"1.0.0"` |
| `updatedAt` | string | ✅ | 更新时间（ISO 8601 格式） |
| `badges` | array | ✅ | 徽章数组 |

**BadgeItem 字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识 |
| `name` | string | ✅ | 显示名称 |
| `enabled` | boolean | ✅ | 是否启用 |
| `priority` | number | - | 优先级（越大越靠前） |
| `renderType` | string | ✅ | 渲染类型，当前仅支持 `"image"` |
| `imageUrl` | string | ✅ | 图片 URL（必须 HTTPS） |
| `linkUrl` | string | ✅ | 跳转链接 |
| `alt` | string | - | 图片描述 |
| `target` | string | - | 链接打开方式：`_self` / `_blank` |
| `width` | number | - | 图片宽度 |
| `height` | number | - | 图片高度 |
| `rules` | object | - | 显示规则 |

---

## 🔒 安全最佳实践

### 1. 配置域名白名单

```typescript
mount('#footer', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: [
      'producthunt.com',
      'tabler.io',
      'yourdomain.com'
    ],
    allowedImageDomains: [
      'cdn.example.com',
      'producthunt.com'
    ]
  }
})
```

### 2. 使用 HTTPS 配置源

```typescript
// ✅ 正确
source: 'https://cdn.example.com/badges.json'

// ❌ 错误
source: 'http://cdn.example.com/badges.json'
```

### 3. 配置内置快照作为降级

```typescript
mount('#footer', {
  source: 'https://cdn.example.com/badges.json',
  fallback: {
    snapshot: {
      configVersion: '1',
      schemaVersion: '1.0.0',
      updatedAt: '2026-03-20T10:00:00Z',
      badges: [
        // 内置的徽章配置
      ]
    }
  }
})
```

---

## 📊 埋点事件

SDK 会在不同时机触发事件，可用于监控和调试：

```typescript
mount('#footer', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      switch (event.type) {
        case 'sdk_init':
          console.log('SDK 初始化', event.source)
          break
        case 'config_fetch_success':
          console.log('配置获取成功', event.configVersion)
          break
        case 'render_success':
          console.log('渲染成功', event.count, '个徽章')
          break
        case 'badge_click':
          console.log('徽章点击', event.badgeId)
          break
      }
    }
  }
})
```

### 事件类型

| 事件类型 | 触发时机 | 携带数据 |
|----------|----------|----------|
| `sdk_init` | SDK 初始化 | `source`, `siteId` |
| `config_fetch_start` | 开始拉取配置 | `source` |
| `config_fetch_success` | 配置拉取成功 | `source`, `configVersion` |
| `config_fetch_failed` | 配置拉取失败 | `source`, `error` |
| `cache_hit` | 命中缓存 | `key`, `configVersion` |
| `render_success` | 渲染成功 | `count` |
| `render_empty` | 无徽章渲染 | - |
| `badge_click` | 徽章被点击 | `badgeId`, `linkUrl` |

---

## 🧪 开发调试

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-org/link-exchange-badges.git
cd link-exchange-badges

# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

### 运行示例

```bash
# React Vite 示例
cd examples/react-vite
pnpm install
pnpm dev

# Next.js 示例
cd examples/nextjs
cp .env.local.example .env.local
# 编辑 .env.local 配置 badges 源
pnpm install
pnpm dev
```

---

## 📖 API 参考

### 核心函数

#### `mount(selector, options)`

通过 CSS 选择器挂载徽章。

```typescript
function mount(
  selector: string,
  options: MountOptions
): Promise<MountResult>
```

#### `mountElement(element, options)`

直接挂载到 DOM 元素。

```typescript
function mountElement(
  element: HTMLElement,
  options: MountOptions
): Promise<MountResult>
```

#### `fetchConfig(source, timeoutMs?, signal?)`

获取远程配置。

```typescript
function fetchConfig(
  source: string,
  timeoutMs?: number,
  signal?: AbortSignal
): Promise<unknown>
```

#### `validateConfig(input)`

验证配置数据。

```typescript
function validateConfig(input: unknown): BadgeConfig
```

---

## ❓ 常见问题

### Q: 如何更新徽章内容？

A: 只需更新远程 JSON 配置文件，SDK 会自动拉取最新配置（受缓存 TTL 影响）。

### Q: 如何禁用缓存？

A: 设置 `cache: { enabled: false }`。

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）。

### Q: 如何处理 CDN 故障？

A: SDK 会自动降级到：
1. 本地缓存（如有效）
2. 内置快照（如配置）
3. 空渲染（静默失败）

### Q: 能否自定义徽章样式？

A: 可以通过 `className` 自定义容器样式，徽章元素有固定的 CSS 类名：
- `.link-exchange-container` - 容器
- `.link-exchange-item` - 单个徽章
- `.link-exchange-image` - 徽章图片

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📞 联系方式

- GitHub Issues: [https://github.com/your-org/link-exchange-badges/issues](https://github.com/your-org/link-exchange-badges/issues)
- 邮箱: support@example.com
