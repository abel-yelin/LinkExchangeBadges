# 类型定义

本节列出 Link Exchange Badges SDK 的所有 TypeScript 类型定义。

## 导入类型

```typescript
import type {
  BadgeItem,
  BadgeConfig,
  MountOptions,
  MountResult,
  ResolveContext,
  SDKEnvironment,
  SDKEvent,
  CachePayload,
  Emitter
} from '@link-exchange/core'

import type {
  LinkExchangeProps
} from '@link-exchange/react'
```

## BadgeItem

徽章项的类型定义。

```typescript
type BadgeItem = {
  /** 徽章唯一标识 */
  id: string

  /** 徽章名称 */
  name: string

  /** 是否启用 */
  enabled: boolean

  /** 分组标识 */
  group?: string

  /** 优先级，数字越大优先级越高 */
  priority: number

  /** 渲染类型，当前仅支持 'image' */
  renderType: 'image'

  /** 图片 URL，renderType 为 'image' 时必填 */
  imageUrl: string

  /** 链接 URL */
  linkUrl: string

  /** 图片替代文本 */
  alt?: string

  /** 链接打开方式 */
  target: '_self' | '_blank'

  /** 链接关系属性 */
  rel: string

  /** 图片宽度（像素） */
  width?: number

  /** 图片高度（像素） */
  height?: number

  /** 显示规则 */
  rules?: {
    /** 允许的站点 ID 列表 */
    siteIds?: string[]

    /** 允许的环境列表 */
    environments?: SDKEnvironment[]

    /** 允许的语言列表 */
    locales?: string[]
  }

  /** 自定义元数据 */
  metadata?: Record<string, unknown>
}
```

## BadgeConfig

配置对象的类型定义。

```typescript
type BadgeConfig = {
  /** 配置版本号，自增整数 */
  configVersion: string

  /** Schema 版本，固定为 '1.0.0' */
  schemaVersion: '1.0.0'

  /** 配置更新时间，ISO 8601 格式 */
  updatedAt: string

  /** 徽章列表 */
  badges: BadgeItem[]
}
```

## MountOptions

挂载选项的类型定义。

```typescript
type MountOptions = {
  /** 配置源 URL，必填 */
  source: string

  /** 宿主站点标识 */
  siteId?: string

  /** 仅渲染指定 group 的徽章 */
  group?: string

  /** 当前运行环境 */
  environment?: SDKEnvironment

  /** 当前语言 */
  locale?: string

  /** 容器元素的 CSS 类名 */
  className?: string

  /** 缓存配置 */
  cache?: {
    /** 是否启用缓存 */
    enabled?: boolean

    /** 缓存有效期（毫秒） */
    ttlMs?: number
  }

  /** Fallback 配置 */
  fallback?: {
    /** 内置 snapshot 配置 */
    snapshot?: BadgeConfig

    /** 是否静默处理所有错误 */
    silent?: boolean
  }

  /** 安全配置 */
  security?: {
    /** 链接域名白名单 */
    allowedLinkDomains?: string[]

    /** 图片域名白名单 */
    allowedImageDomains?: string[]
  }

  /** 遥测配置 */
  telemetry?: {
    /** 是否启用遥测 */
    enabled?: boolean

    /** 事件回调 */
    onEvent?: (event: SDKEvent) => void
  }

  /** 请求超时时间（毫秒） */
  fetchTimeoutMs?: number
}
```

## MountResult

挂载结果的类型定义。

```typescript
interface MountResult {
  /** 卸载徽章的函数 */
  unmount: () => void
}
```

## ResolveContext

解析上下文的类型定义。

```typescript
interface ResolveContext {
  /** 站点标识 */
  siteId?: string

  /** 分组标识 */
  group?: string

  /** 运行环境 */
  environment?: SDKEnvironment

  /** 语言标识 */
  locale?: string
}
```

## SDKEnvironment

环境类型的类型定义。

```typescript
type SDKEnvironment = 'development' | 'staging' | 'production'
```

## SDKEvent

遥测事件的类型定义。

```typescript
type SDKEvent =
  /** 配置获取开始 */
  | { type: 'config_fetch_start'; source: string }

  /** 配置获取成功 */
  | { type: 'config_fetch_success'; source: string; configVersion: string }

  /** 配置获取失败 */
  | { type: 'config_fetch_failed'; source: string; error: string }

  /** 配置验证失败 */
  | { type: 'config_validate_failed'; source: string; error: string }

  /** 缓存命中 */
  | { type: 'cache_hit'; key: string; configVersion: string }

  /** 缓存未命中 */
  | { type: 'cache_miss'; key: string }

  /** 使用过期缓存 */
  | { type: 'cache_stale_used'; key: string; configVersion: string }

  /** 使用快照配置 */
  | { type: 'fallback_snapshot_used' }

  /** 渲染成功 */
  | { type: 'render_success'; count: number }

  /** 渲染结果为空 */
  | { type: 'render_empty' }

  /** 渲染失败 */
  | { type: 'render_failed'; error: string }

  /** 徽章点击 */
  | { type: 'badge_click'; badgeId: string; linkUrl: string }

  /** 目标元素未找到 */
  | { type: 'target_not_found'; selector: string }

  /** SDK 初始化 */
  | { type: 'sdk_init'; source: string; siteId?: string }
```

## CachePayload

缓存负载的类型定义。

```typescript
interface CachePayload {
  /** 缓存时间戳 */
  cachedAt: number

  /** 配置版本 */
  configVersion: string

  /** 配置数据 */
  data: BadgeConfig
}
```

## Emitter

事件发射器的类型定义。

```typescript
type Emitter = (event: SDKEvent) => void
```

## LinkExchangeProps

React 组件 Props 的类型定义。

```typescript
interface LinkExchangeProps extends MountOptions {
  /** 容器元素标签名 */
  as?: 'div' | 'footer' | 'section' | 'nav' | 'main' | 'article' | 'aside'
}
```

## 错误类型

### SDKError

基础错误类。

```typescript
class SDKError extends Error {
  code: string
  details?: unknown
}
```

### TargetNotFoundError

目标元素未找到错误。

```typescript
class TargetNotFoundError extends SDKError {
  selector: string
}
```

### ConfigFetchError

配置获取失败错误。

```typescript
class ConfigFetchError extends SDKError {
  source: string
  cause?: Error
}
```

### ConfigValidationError

配置验证失败错误。

```typescript
class ConfigValidationError extends SDKError {
  source: string
  errors: z.ZodError
}
```

### RenderError

渲染失败错误。

```typescript
class RenderError extends SDKError {
  badgeId?: string
  cause?: Error
}
```

## 使用示例

### 类型导入

```typescript
import type {
  BadgeItem,
  BadgeConfig,
  MountOptions,
  SDKEvent
} from '@link-exchange/core'
```

### 类型注解

```typescript
import type { MountOptions } from '@link-exchange/core'

const options: MountOptions = {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-site',
  environment: 'production'
}

function handleEvent(event: SDKEvent) {
  switch (event.type) {
    case 'config_fetch_start':
      console.log('开始获取配置:', event.source)
      break
    case 'config_fetch_success':
      console.log('配置获取成功:', event.configVersion)
      break
    case 'badge_click':
      console.log('徽章点击:', event.badgeId)
      break
  }
}
```

### 类型守卫

```typescript
import type { SDKEvent } from '@link-exchange/core'

function isConfigFetchEvent(event: SDKEvent): event is
  | { type: 'config_fetch_start'; source: string }
  | { type: 'config_fetch_success'; source: string; configVersion: string }
  | { type: 'config_fetch_failed'; source: string; error: string } {
  return event.type.startsWith('config_fetch')
}

function handleEvent(event: SDKEvent) {
  if (isConfigFetchEvent(event)) {
    console.log('配置事件:', event.source)
  }
}
```

### 类型导出

```typescript
import type { MountOptions } from '@link-exchange/core'

export type BadgeConfigOptions = MountOptions

export function createBadgesConfig(options: BadgeConfigOptions) {
  return options
}
```

### 泛型约束

```typescript
import type { BadgeItem } from '@link-exchange/core'

function filterBadges<T extends BadgeItem>(
  badges: T[],
  predicate: (badge: T) => boolean
): T[] {
  return badges.filter(predicate)
}

const activeBadges = filterBadges(allBadges, badge => badge.enabled)
```

## 类型兼容性

### 与 React 组件兼容

```typescript
import type { MountOptions } from '@link-exchange/core'
import type { LinkExchangeProps } from '@link-exchange/react'

const options: MountOptions = {
  source: 'https://cdn.example.com/badges.json'
}

const props: LinkExchangeProps = {
  ...options,
  as: 'footer'
}
```

### 与 Zod 兼容

```typescript
import { z } from 'zod'
import type { BadgeItem } from '@link-exchange/core'

const BadgeItemSchema: z.ZodType<BadgeItem> = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  // ... 其他字段
})
```

## 下一步

- [核心 API](/api/core)
- [React 组件 API](/api/react)
- [CDN 脚本 API](/api/script)
