# 核心 API

Link Exchange Badges 核心 API (`@link-exchange/core`) 提供底层的徽章渲染功能。

## mount

通过 CSS 选择器查找容器并挂载徽章。

### 签名

```typescript
function mount(
  selector: string,
  options: MountOptions
): Promise<MountResult>
```

### 参数

- **selector**: CSS 选择器字符串
- **options**: 挂载选项对象

### 返回值

返回一个 Promise，解析为 `MountResult` 对象：

```typescript
interface MountResult {
  unmount: () => void  // 卸载徽章的函数
}
```

### 示例

```typescript
import { mount } from '@link-exchange/core'

const result = await mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-site'
})

// 卸载徽章
result.unmount()
```

### 特性

- 自动等待 DOM 准备就绪
- 容器不存在时返回空的 unmount 函数
- 不会中断主应用流程

## mountElement

直接在 DOM 元素上挂载徽章。

### 签名

```typescript
function mountElement(
  element: HTMLElement,
  options: MountOptions
): Promise<MountResult>
```

### 参数

- **element**: DOM 元素
- **options**: 挂载选项对象

### 返回值

返回一个 Promise，解析为 `MountResult` 对象。

### 示例

```typescript
import { mountElement } from '@link-exchange/core'

const element = document.querySelector('#badges')
if (element) {
  const result = await mountElement(element, {
    source: 'https://cdn.example.com/badges.json'
  })

  // 卸载徽章
  result.unmount()
}
```

### 使用场景

- 已有元素引用
- 需要更精确的控制
- 避免选择器查询

## fetchConfig

获取远程配置。

### 签名

```typescript
function fetchConfig(
  source: string,
  timeout?: number
): Promise<BadgeConfig>
```

### 参数

- **source**: 配置文件的 URL
- **timeout**: 可选的超时时间（毫秒）

### 返回值

返回一个 Promise，解析为 `BadgeConfig` 对象。

### 示例

```typescript
import { fetchConfig } from '@link-exchange/core'

const config = await fetchConfig(
  'https://cdn.example.com/badges.json',
  5000
)
console.log(config.badges)
```

## validateConfig

验证配置对象。

### 签名

```typescript
function validateConfig(
  config: unknown
): BadgeConfig
```

### 参数

- **config**: 待验证的配置对象

### 返回值

返回验证后的 `BadgeConfig` 对象。

### 抛出

如果配置无效，抛出 `ConfigValidationError`。

### 示例

```typescript
import { validateConfig, ConfigValidationError } from '@link-exchange/core'

try {
  const config = validateConfig(rawConfig)
  console.log('配置有效:', config)
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('配置无效:', error.message)
  }
}
```

## resolveBadges

解析并过滤徽章。

### 签名

```typescript
function resolveBadges(
  config: BadgeConfig,
  context: ResolveContext
): BadgeItem[]
```

### 参数

- **config**: 配置对象
- **context**: 解析上下文

```typescript
interface ResolveContext {
  siteId?: string
  group?: string
  environment?: SDKEnvironment
  locale?: string
}
```

### 返回值

返回过滤后的徽章数组。

### 示例

```typescript
import { resolveBadges } from '@link-exchange/core'

const badges = resolveBadges(config, {
  siteId: 'my-site',
  environment: 'production',
  group: 'partners'
})
```

## renderBadges

渲染徽章到容器元素。

### 签名

```typescript
function renderBadges(
  container: HTMLElement,
  badges: BadgeItem[],
  options?: {
    className?: string
  }
): RenderResult
```

### 参数

- **container**: 容器元素
- **badges**: 徽章数组
- **options**: 可选的渲染选项

### 返回值

```typescript
interface RenderResult {
  container: HTMLElement
  count: number
  cleanup: () => void
}
```

### 示例

```typescript
import { renderBadges } from '@link-exchange/core'

const result = renderBadges(
  container,
  badges,
  { className: 'my-badges' }
)

console.log(`渲染了 ${result.count} 个徽章`)

// 清理渲染结果
result.cleanup()
```

## 缓存工具

### buildCacheKey

构建缓存键。

```typescript
function buildCacheKey(source: string): string
```

### readCache

读取缓存。

```typescript
function readCache(key: string): CachePayload | null
```

### writeCache

写入缓存。

```typescript
function writeCache(
  key: string,
  payload: CachePayload
): void
```

### clearCache

清除缓存。

```typescript
function clearCache(key: string): void
```

### isCacheValid

检查缓存是否有效。

```typescript
function isCacheValid(
  payload: CachePayload,
  ttlMs: number
): boolean
```

### 示例

```typescript
import {
  buildCacheKey,
  readCache,
  writeCache,
  clearCache,
  isCacheValid
} from '@link-exchange/core'

const key = buildCacheKey('https://cdn.example.com/badges.json')

// 读取缓存
const cached = readCache(key)
if (cached && isCacheValid(cached, 1800000)) {
  console.log('使用缓存:', cached.configVersion)
}

// 写入缓存
writeCache(key, {
  cachedAt: Date.now(),
  configVersion: '1',
  data: config
})

// 清除缓存
clearCache(key)
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

目标元素未找到。

```typescript
class TargetNotFoundError extends SDKError {
  selector: string
}
```

### ConfigFetchError

配置获取失败。

```typescript
class ConfigFetchError extends SDKError {
  source: string
  cause?: Error
}
```

### ConfigValidationError

配置验证失败。

```typescript
class ConfigValidationError extends SDKError {
  source: string
  errors: z.ZodError
}
```

### RenderError

渲染失败。

```typescript
class RenderError extends SDKError {
  badgeId?: string
  cause?: Error
}
```

### 错误处理示例

```typescript
import {
  SDKError,
  TargetNotFoundError,
  ConfigFetchError,
  ConfigValidationError,
  RenderError
} from '@link-exchange/core'

try {
  await mount('#badges', options)
} catch (error) {
  if (error instanceof TargetNotFoundError) {
    console.error('目标元素未找到:', error.selector)
  } else if (error instanceof ConfigFetchError) {
    console.error('配置获取失败:', error.source)
  } else if (error instanceof ConfigValidationError) {
    console.error('配置验证失败:', error.errors)
  } else if (error instanceof RenderError) {
    console.error('渲染失败:', error.badgeId)
  } else if (error instanceof SDKError) {
    console.error('SDK 错误:', error.code, error.message)
  }
}
```

## 类型定义

### BadgeItem

徽章项的类型定义。

```typescript
type BadgeItem = {
  id: string
  name: string
  enabled: boolean
  group?: string
  priority: number
  renderType: 'image'
  imageUrl: string
  linkUrl: string
  alt?: string
  target: '_self' | '_blank'
  rel: string
  width?: number
  height?: number
  rules?: {
    siteIds?: string[]
    environments?: SDKEnvironment[]
    locales?: string[]
  }
  metadata?: Record<string, unknown>
}
```

### BadgeConfig

配置对象的类型定义。

```typescript
type BadgeConfig = {
  configVersion: string
  schemaVersion: '1.0.0'
  updatedAt: string
  badges: BadgeItem[]
}
```

### MountOptions

挂载选项的类型定义。

```typescript
type MountOptions = {
  source: string
  siteId?: string
  group?: string
  environment?: SDKEnvironment
  locale?: string
  className?: string
  cache?: {
    enabled?: boolean
    ttlMs?: number
  }
  fallback?: {
    snapshot?: BadgeConfig
    silent?: boolean
  }
  security?: {
    allowedLinkDomains?: string[]
    allowedImageDomains?: string[]
  }
  telemetry?: {
    enabled?: boolean
    onEvent?: (event: SDKEvent) => void
  }
  fetchTimeoutMs?: number
}
```

### SDKEnvironment

环境类型定义。

```typescript
type SDKEnvironment = 'development' | 'staging' | 'production'
```

### SDKEvent

遥测事件类型定义。

```typescript
type SDKEvent =
  | { type: 'config_fetch_start'; source: string }
  | { type: 'config_fetch_success'; source: string; configVersion: string }
  | { type: 'config_fetch_failed'; source: string; error: string }
  | { type: 'config_validate_failed'; source: string; error: string }
  | { type: 'cache_hit'; key: string; configVersion: string }
  | { type: 'cache_miss'; key: string }
  | { type: 'cache_stale_used'; key: string; configVersion: string }
  | { type: 'fallback_snapshot_used' }
  | { type: 'render_success'; count: number }
  | { type: 'render_empty' }
  | { type: 'render_failed'; error: string }
  | { type: 'badge_click'; badgeId: string; linkUrl: string }
  | { type: 'target_not_found'; selector: string }
  | { type: 'sdk_init'; source: string; siteId?: string }
```

## 下一步

- [React 组件 API](/api/react)
- [CDN 脚本 API](/api/script)
- [类型定义](/api/types)
