# Link Exchange Badge Delivery SDK — 工程开发文档

- 文档版本：v2.0（修订版，可直接落地）
- 状态：Engineering Spec — Ready for Implementation
- 最后更新：2026-03-20
- 适用对象：负责从零实现本 SDK 的工程师 / AI Agent

> **阅读说明**：本文档所有代码示例均为**可直接落地的完整实现**，不是伪代码。实现者应按章节顺序逐模块落地，每个模块的完整文件路径、导出签名、依赖关系均已标注。

---

## 1. 项目目标与非目标

### 1.1 核心目标

构建一套可跨技术栈接入的 Badge Delivery SDK，用于在宿主应用 footer 区域统一展示合作平台 Badge / Featured 标识，内容由远程 JSON 配置驱动，接入方安装一次 SDK 后无需重新发版即可获取最新 Badge 内容。

### 1.2 期望收益

1. 接入方 `npm install` 后，Badge 内容调整无需重新打包或部署。
2. 多站点、多团队、多技术栈使用统一协议与统一配置源。
3. 配置侧可集中维护链接、图片、排序、启停状态。
4. 配置具备基本治理能力：schema 校验、版本管理、回滚、监控。

### 1.3 非目标（一期）

- 任意 HTML 注入
- 第三方脚本注入
- 可视化管理后台（必选交付）
- Vue / Svelte / Web Component adapter
- 复杂 A/B 实验平台
- 曝光去重与精细化归因

---

## 2. 技术栈与工具链

| 工具 | 版本 / 选型 | 说明 |
|------|------------|------|
| 语言 | TypeScript 5.x | 全量类型安全 |
| 包管理 | pnpm 8.x + workspace | Monorepo 管理 |
| 构建 | tsup | 同时输出 ESM / CJS / UMD / .d.ts |
| Schema 校验 | zod 3.x | 与 TypeScript 类型联动 |
| 测试 | vitest | 单元 + 集成测试 |
| Lint | eslint + prettier | 代码风格统一 |
| CI | GitHub Actions | 校验、测试、发布 |

---

## 3. Monorepo 目录结构

```
link-exchange/
├── packages/
│   ├── core/                          # @link-exchange/core
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   │   └── index.ts           # DEFAULT_TTL, CACHE_PREFIX 等常量
│   │   │   ├── errors/
│   │   │   │   └── index.ts           # SDKError 及子类定义
│   │   │   ├── types/
│   │   │   │   └── index.ts           # 所有 TS 类型与 zod schema
│   │   │   ├── utils/
│   │   │   │   └── hash.ts            # 轻量 hash 工具函数
│   │   │   ├── fetch/
│   │   │   │   └── fetchConfig.ts     # 带超时和错误处理的 fetch 封装
│   │   │   ├── cache/
│   │   │   │   └── cache.ts           # localStorage + memory 双层缓存
│   │   │   ├── validate/
│   │   │   │   └── validateConfig.ts  # zod 校验，返回规范化配置
│   │   │   ├── resolve/
│   │   │   │   └── resolveBadges.ts   # 过滤 + 排序逻辑
│   │   │   ├── render/
│   │   │   │   └── renderBadges.ts    # 纯 DOM API 渲染
│   │   │   ├── telemetry/
│   │   │   │   └── telemetry.ts       # 事件类型与上报函数
│   │   │   ├── mount.ts               # mount(selector, options) 入口
│   │   │   ├── mountElement.ts        # mountElement(element, options) 入口
│   │   │   └── index.ts               # 统一导出
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── react/                         # @link-exchange/react
│   │   ├── src/
│   │   │   ├── LinkExchange.tsx       # React 组件
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── script/                        # @link-exchange/script (UMD CDN 包)
│       ├── src/
│       │   ├── global.ts              # window.LinkExchange 挂载
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── configs/
│   ├── schema/
│   │   └── badge-config.schema.json   # JSON Schema（供 CI lint 使用）
│   └── examples/
│       ├── basic.json
│       └── multi-site.json
│
├── examples/
│   ├── html/                          # 纯 HTML 接入示例
│   ├── react-vite/                    # React + Vite 示例
│   └── nextjs/                        # Next.js 14 App Router 示例
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── config-lint.yml
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---

## 4. 数据模型与类型定义

**文件路径：`packages/core/src/types/index.ts`**

这是整个项目最重要的文件，所有其他模块均从此处导入类型。

```typescript
import { z } from 'zod'

// ─── BadgeItem ───────────────────────────────────────────────────────────────

/**
 * 渲染类型判别联合。一期仅支持 'image'。
 * 使用 discriminated union 在类型层面强制约束：
 * 当 renderType = 'image' 时，imageUrl 是必填字段，而不是 optional。
 */
const ImageBadgeItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  enabled: z.boolean(),
  group: z.string().optional(),
  priority: z.number().int().default(0),
  renderType: z.literal('image'),
  imageUrl: z.string().url(),     // renderType=image 时 imageUrl 必填
  linkUrl: z.string().url(),
  alt: z.string().optional(),
  target: z.enum(['_self', '_blank']).default('_blank'),
  rel: z.string().default('noopener noreferrer'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  rules: z
    .object({
      siteIds: z.array(z.string()).optional(),
      environments: z
        .array(z.enum(['development', 'staging', 'production']))
        .optional(),
      locales: z.array(z.string()).optional(),
    })
    .optional(),
  metadata: z.record(z.unknown()).optional(),
})

// 未来扩展示例（二期）：
// const HtmlBadgeItemSchema = z.object({ renderType: z.literal('html'), ... })
// const BadgeItemSchema = z.discriminatedUnion('renderType', [ImageBadgeItemSchema, HtmlBadgeItemSchema])
export const BadgeItemSchema = ImageBadgeItemSchema

export type BadgeItem = z.infer<typeof BadgeItemSchema>

// ─── BadgeConfig（顶层配置对象）─────────────────────────────────────────────

export const BadgeConfigSchema = z.object({
  /**
   * configVersion：自增整数字符串，如 "1", "2", "3"。
   * 不使用日期字符串，便于 SDK 进行大小比较判断新旧。
   * 示例：从 "2026.03.20.1" 迁移为 "1"，并在每次发布时递增。
   */
  configVersion: z.string().min(1),
  /**
   * schemaVersion：本文档所定义的 schema 协议版本，使用 semver。
   * SDK 只处理它声明支持的版本范围，超出范围则降级到 snapshot。
   */
  schemaVersion: z.literal('1.0.0'),
  updatedAt: z.string().datetime(),
  badges: z.array(BadgeItemSchema),
})

export type BadgeConfig = z.infer<typeof BadgeConfigSchema>

// ─── SDK 运行时选项 ──────────────────────────────────────────────────────────

export type SDKEnvironment = 'development' | 'staging' | 'production'

export type MountOptions = {
  /** 配置源 URL，必填。指向远程 badges.json */
  source: string

  /** 宿主站点标识，用于 rules.siteIds 匹配 */
  siteId?: string

  /** 仅渲染指定 group 的 badge；不传则渲染全部 */
  group?: string

  /** 当前运行环境，用于 rules.environments 匹配 */
  environment?: SDKEnvironment

  /** 当前语言，用于 rules.locales 匹配，格式如 'en' / 'zh-CN' */
  locale?: string

  /** 附加在容器 div 上的 CSS className */
  className?: string

  cache?: {
    /** 是否启用缓存，默认 true */
    enabled?: boolean
    /**
     * 缓存有效期（毫秒），默认 30 分钟。
     * 策略：cache-first。TTL 内直接使用缓存，不发远程请求。
     * TTL 过期后发远程请求，失败时缓存仍可作为 fallback（stale fallback）。
     */
    ttlMs?: number
  }

  fallback?: {
    /**
     * 内置 snapshot 配置。
     * 优先级：远程配置 > 本地缓存 > snapshot > 空渲染。
     * 适用于宿主需要确保最低展示一组固定 Badge 的场景。
     */
    snapshot?: BadgeConfig
    /** 所有错误均静默处理，不输出 console.warn，默认 false */
    silent?: boolean
  }

  security?: {
    /**
     * linkUrl 域名白名单，未配置时不限制。
     * 生产环境强烈建议配置，防止远程配置被篡改后跳转到恶意站点。
     */
    allowedLinkDomains?: string[]
    /**
     * imageUrl 域名白名单，未配置时不限制。
     */
    allowedImageDomains?: string[]
  }

  telemetry?: {
    enabled?: boolean
    /**
     * SDK 内部所有事件通过此回调上报，不强绑定任何监控供应商。
     * 宿主可在此接入 Segment / Amplitude / Sentry 等。
     */
    onEvent?: (event: SDKEvent) => void
  }

  /**
   * fetch 请求超时时间（毫秒），默认 5000ms。
   */
  fetchTimeoutMs?: number
}

// ─── Telemetry 事件类型 ──────────────────────────────────────────────────────

export type SDKEvent =
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

// ─── 缓存内部结构 ─────────────────────────────────────────────────────────────

export type CachePayload = {
  cachedAt: number
  configVersion: string
  data: BadgeConfig
}
```

---

## 5. 常量定义

**文件路径：`packages/core/src/constants/index.ts`**

```typescript
export const CACHE_PREFIX = 'link-exchange'
export const DEFAULT_TTL_MS = 30 * 60 * 1000        // 30 分钟
export const DEFAULT_FETCH_TIMEOUT_MS = 5_000        // 5 秒
export const SUPPORTED_SCHEMA_VERSIONS = ['1.0.0']   // SDK 支持的 schema 版本范围
export const CONTAINER_CLASS = 'link-exchange-container'
export const ITEM_CLASS = 'link-exchange-item'
export const IMAGE_CLASS = 'link-exchange-image'
```

---

## 6. 错误类型

**文件路径：`packages/core/src/errors/index.ts`**

```typescript
export class SDKError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SDKError'
  }
}

export class TargetNotFoundError extends SDKError {
  constructor(selector: string) {
    super(`[LinkExchange] Target element not found: "${selector}"`)
    this.name = 'TargetNotFoundError'
  }
}

export class ConfigFetchError extends SDKError {
  constructor(source: string, cause: string) {
    super(`[LinkExchange] Failed to fetch config from "${source}": ${cause}`)
    this.name = 'ConfigFetchError'
  }
}

export class ConfigValidationError extends SDKError {
  constructor(detail: string) {
    super(`[LinkExchange] Config validation failed: ${detail}`)
    this.name = 'ConfigValidationError'
  }
}

export class RenderError extends SDKError {
  constructor(cause: string) {
    super(`[LinkExchange] Render failed: ${cause}`)
    this.name = 'RenderError'
  }
}
```

---

## 7. Hash 工具函数

**文件路径：`packages/core/src/utils/hash.ts`**

> **重要说明**：缓存 key 使用此函数对 `source` URL 做哈希，避免 URL 中包含特殊字符导致 localStorage key 异常。
> 使用 djb2 算法，无需任何外部依赖，输出 8 位十六进制字符串。

```typescript
/**
 * djb2 hash — 将任意字符串映射为 8 位十六进制字符串。
 * 无外部依赖，Browser + Node + Edge Runtime 均可运行。
 *
 * 示例：hash('https://cdn.example.com/badges.json') → 'a3f2b1c9'
 */
export function hash(str: string): string {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h = h >>> 0 // 保持为 32 位无符号整数
  }
  return h.toString(16).padStart(8, '0')
}
```

---

## 8. fetchConfig

**文件路径：`packages/core/src/fetch/fetchConfig.ts`**

```typescript
import { ConfigFetchError } from '../errors'
import { DEFAULT_FETCH_TIMEOUT_MS } from '../constants'

/**
 * 带超时控制的 JSON 配置拉取函数。
 *
 * - 使用 AbortController 实现超时取消
 * - 网络错误、非 2xx 状态码、超时均抛出 ConfigFetchError
 * - 返回值为 unknown，由 validateConfig 负责类型校验
 */
export async function fetchConfig(
  source: string,
  timeoutMs: number = DEFAULT_FETCH_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<unknown> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // 若外部传入了 signal（来自 mount 的 cleanup 逻辑），监听它的中止
  signal?.addEventListener('abort', () => controller.abort())

  try {
    const response = await fetch(source, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ConfigFetchError(
        source,
        `HTTP ${response.status} ${response.statusText}`,
      )
    }

    return await response.json()
  } catch (err) {
    if (err instanceof ConfigFetchError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new ConfigFetchError(source, `Request timed out after ${timeoutMs}ms`)
    }
    throw new ConfigFetchError(source, (err as Error).message)
  } finally {
    clearTimeout(timeoutId)
  }
}
```

---

## 9. validateConfig

**文件路径：`packages/core/src/validate/validateConfig.ts`**

```typescript
import { BadgeConfigSchema, type BadgeConfig } from '../types'
import { ConfigValidationError } from '../errors'
import { SUPPORTED_SCHEMA_VERSIONS } from '../constants'

/**
 * 对 fetchConfig 返回的 unknown 数据进行 zod schema 校验。
 *
 * 校验内容（自动由 zod schema 覆盖）：
 *   - 顶层字段完整性
 *   - schemaVersion 是否在 SDK 支持范围内
 *   - badges 是否为数组
 *   - 每个 badge 的 id、renderType、imageUrl（必须是合法 URL）、linkUrl 等
 *   - width / height 为正数
 *   - target 在允许集合内
 *
 * 返回规范化后的 BadgeConfig（zod 已自动填充 default 值）。
 * 校验失败时抛出 ConfigValidationError，绝不返回半校验状态的数据。
 */
export function validateConfig(input: unknown): BadgeConfig {
  // 先检查 schemaVersion，版本不支持时给出更清晰的错误提示
  if (
    typeof input === 'object' &&
    input !== null &&
    'schemaVersion' in input &&
    !SUPPORTED_SCHEMA_VERSIONS.includes((input as Record<string, unknown>).schemaVersion as string)
  ) {
    throw new ConfigValidationError(
      `Unsupported schemaVersion "${(input as Record<string, unknown>).schemaVersion}". ` +
        `This SDK supports: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
    )
  }

  const result = BadgeConfigSchema.safeParse(input)

  if (!result.success) {
    const detail = result.error.errors
      .map((e) => `[${e.path.join('.')}] ${e.message}`)
      .join('; ')
    throw new ConfigValidationError(detail)
  }

  // 校验 badge id 唯一性（zod 不原生支持 unique 数组检查）
  const ids = result.data.badges.map((b) => b.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (duplicates.length > 0) {
    throw new ConfigValidationError(`Duplicate badge id(s): ${duplicates.join(', ')}`)
  }

  return result.data
}
```

---

## 10. 缓存模块

**文件路径：`packages/core/src/cache/cache.ts`**

> **策略说明（cache-first）**：
> - TTL 内命中缓存 → 直接使用，不发远程请求
> - TTL 过期 → 发远程请求，请求失败时使用过期缓存（stale fallback）
> - localStorage 不可用（SSR、隐私模式） → 自动降级到内存缓存
> - localStorage.setItem 抛异常（隐私模式 Safari ITP 等）→ catch 后使用内存缓存

```typescript
import { hash } from '../utils/hash'
import { CACHE_PREFIX, DEFAULT_TTL_MS } from '../constants'
import type { CachePayload } from '../types'

// ─── Memory Fallback Cache ────────────────────────────────────────────────────
// localStorage 不可用时（SSR、隐私模式）使用此内存缓存。
// 内存缓存在页面刷新后失效，仅作为当次会话的降级方案。
const memoryCache = new Map<string, CachePayload>()

// ─── 工具：判断是否处于浏览器环境 ─────────────────────────────────────────────
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

// ─── 生成缓存 Key ─────────────────────────────────────────────────────────────
export function buildCacheKey(
  source: string,
  siteId?: string,
  group?: string,
): string {
  return `${CACHE_PREFIX}:${hash(source)}:${siteId ?? 'default'}:${group ?? 'all'}`
}

// ─── 读取缓存 ─────────────────────────────────────────────────────────────────
export function readCache(key: string): CachePayload | null {
  // 1. 优先尝试 localStorage
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as CachePayload
    } catch {
      // localStorage 读取失败（数据损坏等），继续尝试内存缓存
    }
  }
  // 2. 降级到内存缓存
  return memoryCache.get(key) ?? null
}

// ─── 写入缓存 ─────────────────────────────────────────────────────────────────
export function writeCache(key: string, payload: CachePayload): void {
  // 1. 优先写 localStorage
  if (isBrowser()) {
    try {
      localStorage.setItem(key, JSON.stringify(payload))
      return
    } catch {
      // 隐私模式 / 存储空间满 / Safari ITP 等导致写入失败，降级到内存缓存
    }
  }
  // 2. 降级到内存缓存
  memoryCache.set(key, payload)
}

// ─── 判断缓存是否在 TTL 内有效 ────────────────────────────────────────────────
export function isCacheValid(
  payload: CachePayload,
  ttlMs: number = DEFAULT_TTL_MS,
): boolean {
  return Date.now() - payload.cachedAt < ttlMs
}

// ─── 清除指定缓存 ─────────────────────────────────────────────────────────────
export function clearCache(key: string): void {
  if (isBrowser()) {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }
  memoryCache.delete(key)
}
```

---

## 11. URL 安全校验

**文件路径：`packages/core/src/utils/security.ts`**

```typescript
/**
 * 校验 URL 是否合法（必须是 http / https 协议）。
 * javascript:、data:、blob: 等协议一律拒绝。
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 校验 URL 的 hostname 是否在白名单内。
 * 白名单为空时，返回 true（不限制）。
 *
 * 示例：isAllowedDomain('https://producthunt.com/...', ['producthunt.com', 'cdn.example.com'])
 *         → true
 */
export function isAllowedDomain(url: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) return true
  try {
    const { hostname } = new URL(url)
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  } catch {
    return false
  }
}

/**
 * 对 badge 的 linkUrl / imageUrl 进行联合安全校验。
 * 只保留通过白名单过滤的 badge，剔除的 badge 不影响其他 badge 展示。
 */
export function filterSafeBadges<T extends { linkUrl: string; imageUrl: string }>(
  badges: T[],
  options?: {
    allowedLinkDomains?: string[]
    allowedImageDomains?: string[]
  },
): T[] {
  return badges.filter((badge) => {
    if (!isValidUrl(badge.linkUrl)) return false
    if (!isValidUrl(badge.imageUrl)) return false
    if (!isAllowedDomain(badge.linkUrl, options?.allowedLinkDomains)) return false
    if (!isAllowedDomain(badge.imageUrl, options?.allowedImageDomains)) return false
    return true
  })
}
```

---

## 12. resolveBadges

**文件路径：`packages/core/src/resolve/resolveBadges.ts`**

```typescript
import type { BadgeConfig, BadgeItem, SDKEnvironment } from '../types'
import { filterSafeBadges } from '../utils/security'

export type ResolveContext = {
  siteId?: string
  group?: string
  environment?: SDKEnvironment
  locale?: string
  security?: {
    allowedLinkDomains?: string[]
    allowedImageDomains?: string[]
  }
}

/**
 * 按以下顺序过滤和排序 badge：
 *
 * 1. 过滤 enabled !== true 的项
 * 2. 若传入 group，按 group 过滤（精确匹配）
 * 3. 若 badge.rules.siteIds 有值，siteId 必须命中（未命中则剔除）
 *    若 badge.rules.siteIds 为空或 undefined，则对所有 site 生效
 * 4. 若 badge.rules.environments 有值，environment 必须命中
 * 5. 若 badge.rules.locales 有值，locale 必须命中
 * 6. 安全白名单过滤（linkUrl / imageUrl 域名）
 * 7. 按 priority 降序排序（priority 越大越靠前，默认 0）
 */
export function resolveBadges(config: BadgeConfig, ctx: ResolveContext): BadgeItem[] {
  let badges = config.badges

  // Step 1: enabled 过滤
  badges = badges.filter((b) => b.enabled === true)

  // Step 2: group 过滤
  if (ctx.group !== undefined) {
    badges = badges.filter((b) => b.group === ctx.group)
  }

  // Step 3: siteIds 规则匹配
  if (ctx.siteId !== undefined) {
    badges = badges.filter((b) => {
      if (!b.rules?.siteIds || b.rules.siteIds.length === 0) return true // 无限制，全部生效
      return b.rules.siteIds.includes(ctx.siteId!)
    })
  }

  // Step 4: environments 规则匹配
  if (ctx.environment !== undefined) {
    badges = badges.filter((b) => {
      if (!b.rules?.environments || b.rules.environments.length === 0) return true
      return b.rules.environments.includes(ctx.environment!)
    })
  }

  // Step 5: locales 规则匹配
  if (ctx.locale !== undefined) {
    badges = badges.filter((b) => {
      if (!b.rules?.locales || b.rules.locales.length === 0) return true
      return b.rules.locales.includes(ctx.locale!)
    })
  }

  // Step 6: 安全白名单过滤
  badges = filterSafeBadges(badges, ctx.security)

  // Step 7: priority 降序排序（稳定排序）
  badges = [...badges].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

  return badges
}
```

---

## 13. Telemetry 模块

**文件路径：`packages/core/src/telemetry/telemetry.ts`**

```typescript
import type { SDKEvent, MountOptions } from '../types'

/**
 * 创建一个绑定了 options.telemetry 配置的 emit 函数。
 *
 * 使用工厂模式而非全局单例，确保每次 mount 调用都是独立的 telemetry 上下文。
 *
 * 示例：
 *   const emit = createEmitter(options)
 *   emit({ type: 'config_fetch_start', source: options.source })
 */
export function createEmitter(options: Pick<MountOptions, 'telemetry' | 'fallback'>) {
  return function emit(event: SDKEvent): void {
    if (!options.telemetry?.enabled) return
    if (!options.telemetry?.onEvent) return

    try {
      options.telemetry.onEvent(event)
    } catch {
      // telemetry 上报本身的错误不应影响主流程
    }
  }
}

export type Emitter = ReturnType<typeof createEmitter>
```

---

## 14. renderBadges

**文件路径：`packages/core/src/render/renderBadges.ts`**

> **安全规范**：
> - 所有属性写入使用 `setAttribute` / 直接属性赋值，**禁止 innerHTML 拼接**
> - `<script>` / `data:` / `javascript:` 类属性值在安全模块已过滤，此处不做二次判断

```typescript
import type { BadgeItem, MountOptions } from '../types'
import { CONTAINER_CLASS, ITEM_CLASS, IMAGE_CLASS } from '../constants'
import type { Emitter } from '../telemetry/telemetry'
import { RenderError } from '../errors'

export type RenderOptions = {
  className?: string
  security?: MountOptions['security']
  emit: Emitter
}

/**
 * 将 BadgeItem[] 渲染到目标 HTMLElement 中。
 *
 * 输出 DOM 结构：
 * <div class="link-exchange-container [className]">
 *   <a class="link-exchange-item" href="..." target="_blank" rel="noopener noreferrer">
 *     <img class="link-exchange-image" src="..." alt="..." width="250" height="54" loading="lazy" />
 *   </a>
 * </div>
 *
 * badge_click telemetry 在此处绑定，通过 emit 上报。
 * 返回一个 cleanup 函数，用于解绑所有事件监听器。
 */
export function renderBadges(
  target: HTMLElement,
  badges: BadgeItem[],
  options: RenderOptions,
): () => void {
  const { emit, className } = options

  // 清空容器（避免重复渲染累积）
  target.innerHTML = ''

  if (badges.length === 0) {
    emit({ type: 'render_empty' })
    return () => {}
  }

  const cleanupFns: Array<() => void> = []

  try {
    const container = document.createElement('div')
    container.className = [CONTAINER_CLASS, className].filter(Boolean).join(' ')

    for (const badge of badges) {
      const link = document.createElement('a')
      link.className = ITEM_CLASS
      link.setAttribute('href', badge.linkUrl)
      link.setAttribute('target', badge.target ?? '_blank')
      link.setAttribute('rel', badge.rel ?? 'noopener noreferrer')

      // badge_click 事件上报
      const clickHandler = () => {
        emit({ type: 'badge_click', badgeId: badge.id, linkUrl: badge.linkUrl })
      }
      link.addEventListener('click', clickHandler)
      cleanupFns.push(() => link.removeEventListener('click', clickHandler))

      if (badge.renderType === 'image') {
        const img = document.createElement('img')
        img.className = IMAGE_CLASS
        img.setAttribute('src', badge.imageUrl)
        img.setAttribute('alt', badge.alt ?? badge.name)
        img.setAttribute('loading', 'lazy')
        if (badge.width != null) img.setAttribute('width', String(badge.width))
        if (badge.height != null) img.setAttribute('height', String(badge.height))

        link.appendChild(img)
      }

      container.appendChild(link)
    }

    target.appendChild(container)

    emit({ type: 'render_success', count: badges.length })
  } catch (err) {
    const msg = (err as Error).message
    emit({ type: 'render_failed', error: msg })
    throw new RenderError(msg)
  }

  // 返回 cleanup 函数，解绑所有 click 监听器
  return () => {
    for (const fn of cleanupFns) fn()
  }
}
```

---

## 15. 主流程：mountElement

**文件路径：`packages/core/src/mountElement.ts`**

> 这是整个 SDK 最核心的执行链路。`mount` 和 React adapter 最终都调用此函数。

```typescript
import { fetchConfig } from './fetch/fetchConfig'
import { validateConfig } from './validate/validateConfig'
import { resolveBadges } from './resolve/resolveBadges'
import { renderBadges } from './render/renderBadges'
import { buildCacheKey, readCache, writeCache, isCacheValid } from './cache/cache'
import { createEmitter } from './telemetry/telemetry'
import type { MountOptions, BadgeConfig } from './types'
import { DEFAULT_TTL_MS, DEFAULT_FETCH_TIMEOUT_MS } from './constants'

export type MountResult = {
  /** 调用此函数可清理事件监听器、取消进行中的 fetch 请求 */
  unmount: () => void
}

/**
 * 对传入的 HTMLElement 执行完整的 fetch → validate → resolve → render 流程。
 *
 * 返回值 MountResult.unmount() 必须在组件卸载时调用，否则：
 * - 正在进行的 fetch 请求不会被取消
 * - badge 的 click 事件监听器不会被解绑
 *
 * 完整流程：
 * 1. 初始化 emitter、abort controller
 * 2. 检查缓存（cache-first）
 * 3. TTL 有效 → 直接使用缓存渲染，跳过远程请求
 * 4. TTL 过期 → 拉取远程配置
 * 5. 远程成功 → 校验 → 写缓存 → 渲染
 * 6. 远程失败 → 使用过期缓存（stale fallback）
 * 7. 缓存也没有 → 使用 snapshot
 * 8. snapshot 也没有 → 空渲染（不抛错，不影响宿主应用）
 */
export async function mountElement(
  element: HTMLElement,
  options: MountOptions,
): Promise<MountResult> {
  const emit = createEmitter(options)
  const abortController = new AbortController()
  let renderCleanup: (() => void) | null = null

  const unmount = () => {
    abortController.abort()
    renderCleanup?.()
  }

  emit({ type: 'sdk_init', source: options.source, siteId: options.siteId })

  const ttlMs = options.cache?.ttlMs ?? DEFAULT_TTL_MS
  const fetchTimeoutMs = options.fetchTimeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS
  const cacheEnabled = options.cache?.enabled !== false

  const cacheKey = buildCacheKey(options.source, options.siteId, options.group)

  const resolveAndRender = (config: BadgeConfig) => {
    const badges = resolveBadges(config, {
      siteId: options.siteId,
      group: options.group,
      environment: options.environment,
      locale: options.locale,
      security: options.security,
    })

    renderCleanup = renderBadges(element, badges, {
      className: options.className,
      emit,
    })
  }

  // ─── Step 1: 检查缓存 ─────────────────────────────────────────────────────
  const cached = cacheEnabled ? readCache(cacheKey) : null

  if (cached && isCacheValid(cached, ttlMs)) {
    // 缓存命中且 TTL 有效 → 直接渲染，不发请求
    emit({ type: 'cache_hit', key: cacheKey, configVersion: cached.configVersion })
    resolveAndRender(cached.data)
    return { unmount }
  }

  // 记录 stale 缓存，供远程失败时使用
  const staleCache = cached ?? null
  emit({ type: 'cache_miss', key: cacheKey })

  // ─── Step 2: 拉取远程配置 ──────────────────────────────────────────────────
  let remoteConfig: BadgeConfig | null = null
  emit({ type: 'config_fetch_start', source: options.source })

  try {
    const raw = await fetchConfig(
      options.source,
      fetchTimeoutMs,
      abortController.signal,
    )
    const validated = validateConfig(raw)
    remoteConfig = validated
    emit({
      type: 'config_fetch_success',
      source: options.source,
      configVersion: validated.configVersion,
    })
  } catch (err) {
    const error = (err as Error).message

    if ((err as Error).name === 'ConfigValidationError') {
      emit({ type: 'config_validate_failed', source: options.source, error })
    } else {
      emit({ type: 'config_fetch_failed', source: options.source, error })
    }

    if (!options.fallback?.silent) {
      console.warn('[LinkExchange]', error)
    }
  }

  // ─── Step 3: 远程成功 → 写缓存 → 渲染 ──────────────────────────────────────
  if (remoteConfig) {
    if (cacheEnabled) {
      writeCache(cacheKey, {
        cachedAt: Date.now(),
        configVersion: remoteConfig.configVersion,
        data: remoteConfig,
      })
    }
    resolveAndRender(remoteConfig)
    return { unmount }
  }

  // ─── Step 4: 远程失败 → stale 缓存兜底 ───────────────────────────────────────
  if (staleCache) {
    emit({
      type: 'cache_stale_used',
      key: cacheKey,
      configVersion: staleCache.configVersion,
    })
    resolveAndRender(staleCache.data)
    return { unmount }
  }

  // ─── Step 5: snapshot 兜底 ────────────────────────────────────────────────
  if (options.fallback?.snapshot) {
    emit({ type: 'fallback_snapshot_used' })
    resolveAndRender(options.fallback.snapshot)
    return { unmount }
  }

  // ─── Step 6: 全部失败 → 空渲染（不影响宿主应用）────────────────────────────
  emit({ type: 'render_empty' })
  return { unmount }
}
```

---

## 16. mount（selector 入口）

**文件路径：`packages/core/src/mount.ts`**

```typescript
import { mountElement, type MountResult } from './mountElement'
import { TargetNotFoundError } from './errors'
import { createEmitter } from './telemetry/telemetry'
import type { MountOptions } from './types'

/**
 * 通过 CSS selector 查找容器并执行挂载。
 *
 * 容器不存在时上报 telemetry 并抛出非致命错误（console.warn），
 * 不会中断宿主应用的主流程。
 *
 * 支持 DOM 未就绪时自动等待（针对 <head> 内 script 引入场景）。
 */
export async function mount(
  selector: string,
  options: MountOptions,
): Promise<MountResult> {
  const emit = createEmitter(options)

  const doMount = async (): Promise<MountResult> => {
    const element = document.querySelector<HTMLElement>(selector)

    if (!element) {
      emit({ type: 'target_not_found', selector })
      const err = new TargetNotFoundError(selector)
      if (!options.fallback?.silent) {
        console.warn(err.message)
      }
      // 返回一个空的 unmount，避免调用方 null check
      return { unmount: () => {} }
    }

    return mountElement(element, options)
  }

  // DOM 未就绪时（如 script 在 <head> 中且没有 defer）等待 DOMContentLoaded
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        void doMount().then(resolve)
      })
    })
  }

  return doMount()
}
```

---

## 17. Core 包统一导出

**文件路径：`packages/core/src/index.ts`**

```typescript
// 主要 API
export { mount } from './mount'
export { mountElement } from './mountElement'

// 可单独使用的子函数（供高级场景）
export { fetchConfig } from './fetch/fetchConfig'
export { validateConfig } from './validate/validateConfig'
export { resolveBadges } from './resolve/resolveBadges'
export { renderBadges } from './render/renderBadges'

// 缓存工具
export { buildCacheKey, readCache, writeCache, clearCache, isCacheValid } from './cache/cache'

// 类型
export type {
  BadgeItem,
  BadgeConfig,
  MountOptions,
  SDKEnvironment,
  SDKEvent,
  CachePayload,
  ResolveContext,
} from './types'
export type { MountResult } from './mountElement'

// 错误类型
export {
  SDKError,
  TargetNotFoundError,
  ConfigFetchError,
  ConfigValidationError,
  RenderError,
} from './errors'
```

---

## 18. React Adapter

**文件路径：`packages/react/src/LinkExchange.tsx`**

> **关键修复项（相比常见错误实现）**：
> 1. `useEffect` 依赖使用关键字段的显式列表，不传整个 `options` 对象引用
> 2. 返回 cleanup 函数，调用 `mountResult.unmount()` 解绑事件监听器和取消 fetch
> 3. `isMounted` flag 防止组件卸载后的异步回调继续操作 DOM
> 4. SSR 兼容：`useEffect` 仅在客户端执行，不在 Node 端访问 DOM

```tsx
import { useEffect, useRef, type JSX } from 'react'
import { mountElement, type MountResult } from '@link-exchange/core'
import type { MountOptions } from '@link-exchange/core'

export type LinkExchangeProps = MountOptions & {
  /**
   * 容器标签名，默认 'div'。
   * 传入 'footer' / 'section' 等语义化标签可改善 accessibility。
   */
  as?: keyof JSX.IntrinsicElements
}

export function LinkExchange({ as: Tag = 'div', ...options }: LinkExchangeProps) {
  const ref = useRef<HTMLElement | null>(null)
  const mountResultRef = useRef<MountResult | null>(null)

  useEffect(() => {
    if (!ref.current) return

    let isMounted = true

    void mountElement(ref.current, options).then((result) => {
      if (!isMounted) {
        // 组件在 fetch 完成前已卸载，立即清理
        result.unmount()
        return
      }
      mountResultRef.current = result
    })

    return () => {
      isMounted = false
      // 清理：取消进行中的 fetch + 解绑 click 事件监听器
      mountResultRef.current?.unmount()
      mountResultRef.current = null
    }
  }, [
    // 只监听真正影响渲染结果的字段，避免 options 对象引用变化触发无限重渲染
    options.source,
    options.siteId,
    options.group,
    options.environment,
    options.locale,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ])

  // Tag 作为泛型标签使用时需要类型断言
  return <Tag ref={ref as React.Ref<HTMLDivElement>} />
}
```

**文件路径：`packages/react/src/index.ts`**

```typescript
export { LinkExchange } from './LinkExchange'
export type { LinkExchangeProps } from './LinkExchange'
```

---

## 19. Script Embed（UMD CDN 包）

**文件路径：`packages/script/src/global.ts`**

```typescript
import { mount, mountElement } from '@link-exchange/core'

/**
 * 挂载到全局 window 对象，供 CDN <script> 引入方式使用。
 *
 * 使用方式：
 *   <script src="https://cdn.example.com/link-exchange.min.js"></script>
 *   <script>
 *     window.LinkExchange.mount('#footer', { source: '...' })
 *   </script>
 */
if (typeof window !== 'undefined') {
  ;(
    window as typeof window & {
      LinkExchange: { mount: typeof mount; mountElement: typeof mountElement }
    }
  ).LinkExchange = { mount, mountElement }
}
```

**文件路径：`packages/script/src/index.ts`**

```typescript
import './global'
export { mount, mountElement } from '@link-exchange/core'
```

---

## 20. 包配置文件

### `packages/core/package.json`

```json
{
  "name": "@link-exchange/core",
  "version": "0.1.0",
  "description": "Link Exchange Badge Delivery SDK — Core",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false,
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### `packages/react/package.json`

```json
{
  "name": "@link-exchange/react",
  "version": "0.1.0",
  "description": "Link Exchange Badge Delivery SDK — React Adapter",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false,
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean --external react",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch --external react",
    "test": "vitest run"
  },
  "dependencies": {
    "@link-exchange/core": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### `packages/script/package.json`

```json
{
  "name": "@link-exchange/script",
  "version": "0.1.0",
  "description": "Link Exchange Badge Delivery SDK — CDN Script Bundle",
  "type": "module",
  "main": "./dist/link-exchange.umd.cjs",
  "module": "./dist/link-exchange.esm.js",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,umd --global-name LinkExchange --minify --clean",
    "dev": "tsup src/index.ts --format esm,umd --global-name LinkExchange --watch"
  },
  "dependencies": {
    "@link-exchange/core": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 根目录 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'examples/*'
```

### 根目录 `package.json`

```json
{
  "name": "link-exchange",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "dev": "pnpm -r run dev --parallel"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 根目录 `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

---

## 21. 配置文件 Schema 与示例

### `configs/schema/badge-config.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "BadgeConfig",
  "type": "object",
  "required": ["configVersion", "schemaVersion", "updatedAt", "badges"],
  "additionalProperties": false,
  "properties": {
    "configVersion": {
      "type": "string",
      "description": "自增整数字符串，如 '1', '2', '3'。每次发布必须更新。"
    },
    "schemaVersion": {
      "type": "string",
      "enum": ["1.0.0"]
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "badges": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "enabled", "renderType", "imageUrl", "linkUrl"],
        "additionalProperties": false,
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "name": { "type": "string", "minLength": 1 },
          "enabled": { "type": "boolean" },
          "group": { "type": "string" },
          "priority": { "type": "integer", "default": 0 },
          "renderType": { "type": "string", "enum": ["image"] },
          "imageUrl": { "type": "string", "format": "uri" },
          "linkUrl": { "type": "string", "format": "uri" },
          "alt": { "type": "string" },
          "target": { "type": "string", "enum": ["_self", "_blank"], "default": "_blank" },
          "rel": { "type": "string", "default": "noopener noreferrer" },
          "width": { "type": "number", "exclusiveMinimum": 0 },
          "height": { "type": "number", "exclusiveMinimum": 0 },
          "rules": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "siteIds": { "type": "array", "items": { "type": "string" } },
              "environments": {
                "type": "array",
                "items": { "type": "string", "enum": ["development", "staging", "production"] }
              },
              "locales": { "type": "array", "items": { "type": "string" } }
            }
          },
          "metadata": { "type": "object" }
        }
      }
    }
  }
}
```

### `configs/examples/basic.json`

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
      "imageUrl": "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=123",
      "linkUrl": "https://www.producthunt.com/posts/example",
      "alt": "Featured on Product Hunt",
      "target": "_blank",
      "rel": "noopener noreferrer",
      "width": 250,
      "height": 54
    },
    {
      "id": "tabler",
      "name": "Featured on Tabler",
      "enabled": true,
      "group": "featured",
      "priority": 90,
      "renderType": "image",
      "imageUrl": "https://tabler.io/badges/featured.svg",
      "linkUrl": "https://tabler.io/templates/example",
      "alt": "Featured on Tabler",
      "target": "_blank",
      "width": 200,
      "height": 54,
      "rules": {
        "environments": ["production"]
      }
    }
  ]
}
```

### `configs/examples/multi-site.json`

```json
{
  "configVersion": "2",
  "schemaVersion": "1.0.0",
  "updatedAt": "2026-03-20T12:00:00Z",
  "badges": [
    {
      "id": "producthunt-global",
      "name": "Product Hunt",
      "enabled": true,
      "group": "featured",
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=123",
      "linkUrl": "https://www.producthunt.com/posts/example",
      "alt": "Featured on Product Hunt",
      "width": 250,
      "height": 54
    },
    {
      "id": "launchigniter",
      "name": "LaunchIgniter",
      "enabled": true,
      "group": "featured",
      "priority": 80,
      "renderType": "image",
      "imageUrl": "https://launchigniter.com/badges/featured.svg",
      "linkUrl": "https://launchigniter.com/products/example",
      "alt": "Featured on LaunchIgniter",
      "width": 220,
      "height": 54,
      "rules": {
        "siteIds": ["marketing-site"],
        "environments": ["production"],
        "locales": ["en", "zh-CN"]
      }
    },
    {
      "id": "docs-site-only",
      "name": "Docs Badge",
      "enabled": true,
      "group": "docs",
      "priority": 50,
      "renderType": "image",
      "imageUrl": "https://cdn.example.com/badges/docs.svg",
      "linkUrl": "https://docs.example.com",
      "alt": "Documentation",
      "rules": {
        "siteIds": ["docs-site"]
      }
    }
  ]
}
```

---

## 22. 接入示例

### 22.1 纯 HTML（`examples/html/index.html`）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Link Exchange — HTML Example</title>
</head>
<body>
  <main>
    <h1>My App</h1>
  </main>

  <footer>
    <p>&copy; 2026 My App</p>
    <!-- SDK 挂载目标 -->
    <div id="link-exchange-footer"></div>
  </footer>

  <!-- CDN 引入 UMD 包 -->
  <script src="https://cdn.example.com/link-exchange.min.js"></script>
  <script>
    window.LinkExchange.mount('#link-exchange-footer', {
      source: 'https://cdn.example.com/badges/basic.json',
      siteId: 'marketing-site',
      group: 'featured',
      environment: 'production',
      cache: { enabled: true, ttlMs: 30 * 60 * 1000 },
      telemetry: {
        enabled: true,
        onEvent(event) {
          console.log('[LinkExchange]', event.type, event)
        },
      },
      fallback: { silent: false },
    })
  </script>
</body>
</html>
```

### 22.2 React + Vite（`examples/react-vite/src/Footer.tsx`）

```tsx
import { LinkExchange } from '@link-exchange/react'

export function Footer() {
  return (
    <footer style={{ padding: '24px 0', borderTop: '1px solid #eee' }}>
      <p>&copy; 2026 My App</p>
      <LinkExchange
        source="https://cdn.example.com/badges/basic.json"
        siteId="marketing-site"
        group="featured"
        environment="production"
        locale="en"
        cache={{ enabled: true, ttlMs: 30 * 60 * 1000 }}
        security={{
          allowedLinkDomains: ['producthunt.com', 'tabler.io'],
          allowedImageDomains: ['api.producthunt.com', 'tabler.io'],
        }}
        telemetry={{
          enabled: true,
          onEvent(event) {
            if (event.type === 'badge_click') {
              // 接入自己的 analytics
              analytics.track('badge_click', { badgeId: event.badgeId })
            }
          },
        }}
      />
    </footer>
  )
}
```

### 22.3 Next.js 14 App Router（`examples/nextjs/app/components/Footer.tsx`）

> **SSR 说明**：`LinkExchange` 组件通过 `useEffect` 在客户端执行挂载逻辑，不在服务端访问 DOM / localStorage。
> 但 Next.js App Router 要求组件文件顶部显式声明 `'use client'`。

```tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function Footer() {
  return (
    <footer>
      <p>&copy; 2026 My App</p>
      <LinkExchange
        source={process.env.NEXT_PUBLIC_BADGES_JSON_URL!}
        siteId="docs-site"
        environment={
          process.env.NODE_ENV === 'production' ? 'production' : 'development'
        }
        cache={{ enabled: true }}
        fallback={{ silent: true }}
      />
    </footer>
  )
}
```

### 22.4 Vanilla JS / TypeScript（直接调用 Core API）

```typescript
import { mount } from '@link-exchange/core'

// mount 返回 MountResult，页面销毁时调用 unmount 进行清理
const { unmount } = await mount('#footer-badges', {
  source: 'https://cdn.example.com/badges/basic.json',
  siteId: 'docs-site',
  group: 'featured',
  environment: 'production',
  locale: 'en',
  cache: { enabled: true, ttlMs: 30 * 60 * 1000 },
  telemetry: {
    enabled: true,
    onEvent(event) {
      console.log('[LinkExchange]', event)
    },
  },
})

// SPA 路由离开时清理
window.addEventListener('beforeunload', unmount)
```

---

## 23. 测试方案

### 23.1 单元测试：resolveBadges

**文件路径：`packages/core/src/resolve/__tests__/resolveBadges.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { resolveBadges } from '../resolveBadges'
import type { BadgeConfig } from '../../types'

const makeConfig = (overrides: Partial<BadgeConfig['badges'][number]>[] = []): BadgeConfig => ({
  configVersion: '1',
  schemaVersion: '1.0.0',
  updatedAt: '2026-01-01T00:00:00Z',
  badges: overrides.map((o, i) => ({
    id: `badge-${i}`,
    name: `Badge ${i}`,
    enabled: true,
    priority: 0,
    renderType: 'image',
    imageUrl: 'https://example.com/img.svg',
    linkUrl: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    ...o,
  })),
})

describe('resolveBadges', () => {
  it('过滤 enabled=false 的 badge', () => {
    const config = makeConfig([{ enabled: false }, { enabled: true }])
    const result = resolveBadges(config, {})
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('badge-1')
  })

  it('按 group 过滤', () => {
    const config = makeConfig([{ group: 'featured' }, { group: 'partners' }])
    const result = resolveBadges(config, { group: 'featured' })
    expect(result).toHaveLength(1)
    expect(result[0].group).toBe('featured')
  })

  it('按 priority 降序排序', () => {
    const config = makeConfig([{ priority: 10 }, { priority: 50 }, { priority: 30 }])
    const result = resolveBadges(config, {})
    expect(result.map((b) => b.priority)).toEqual([50, 30, 10])
  })

  it('siteIds 规则：未配置 siteIds 时对所有 site 生效', () => {
    const config = makeConfig([{ rules: undefined }])
    const result = resolveBadges(config, { siteId: 'any-site' })
    expect(result).toHaveLength(1)
  })

  it('siteIds 规则：siteId 不命中时剔除该 badge', () => {
    const config = makeConfig([{ rules: { siteIds: ['marketing-site'] } }])
    const result = resolveBadges(config, { siteId: 'docs-site' })
    expect(result).toHaveLength(0)
  })

  it('environments 规则：environment 不命中时剔除', () => {
    const config = makeConfig([{ rules: { environments: ['production'] } }])
    const result = resolveBadges(config, { environment: 'development' })
    expect(result).toHaveLength(0)
  })

  it('安全过滤：linkUrl 非 http/https 时剔除', () => {
    const config = makeConfig([{ linkUrl: 'javascript:alert(1)' }])
    const result = resolveBadges(config, {})
    expect(result).toHaveLength(0)
  })
})
```

### 23.2 单元测试：缓存模块

**文件路径：`packages/core/src/cache/__tests__/cache.test.ts`**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { buildCacheKey, writeCache, readCache, isCacheValid, clearCache } from '../cache'
import type { CachePayload } from '../../types'

const mockPayload = (): CachePayload => ({
  cachedAt: Date.now(),
  configVersion: '1',
  data: {
    configVersion: '1',
    schemaVersion: '1.0.0',
    updatedAt: '2026-01-01T00:00:00Z',
    badges: [],
  },
})

describe('buildCacheKey', () => {
  it('相同参数生成相同 key', () => {
    const k1 = buildCacheKey('https://cdn.example.com/a.json', 'site-a', 'featured')
    const k2 = buildCacheKey('https://cdn.example.com/a.json', 'site-a', 'featured')
    expect(k1).toBe(k2)
  })

  it('不同参数生成不同 key', () => {
    const k1 = buildCacheKey('https://cdn.example.com/a.json', 'site-a')
    const k2 = buildCacheKey('https://cdn.example.com/b.json', 'site-b')
    expect(k1).not.toBe(k2)
  })
})

describe('isCacheValid', () => {
  it('TTL 内返回 true', () => {
    const payload = mockPayload()
    expect(isCacheValid(payload, 60_000)).toBe(true)
  })

  it('TTL 过期返回 false', () => {
    const payload: CachePayload = { ...mockPayload(), cachedAt: Date.now() - 120_000 }
    expect(isCacheValid(payload, 60_000)).toBe(false)
  })
})

describe('readCache / writeCache / clearCache', () => {
  const key = 'test-cache-key'

  beforeEach(() => clearCache(key))

  it('写入后可以读取', () => {
    const payload = mockPayload()
    writeCache(key, payload)
    const result = readCache(key)
    expect(result?.configVersion).toBe('1')
  })

  it('清除后返回 null', () => {
    writeCache(key, mockPayload())
    clearCache(key)
    expect(readCache(key)).toBeNull()
  })
})
```

### 23.3 单元测试：validateConfig

**文件路径：`packages/core/src/validate/__tests__/validateConfig.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { validateConfig } from '../validateConfig'
import { ConfigValidationError } from '../../errors'

const validInput = {
  configVersion: '1',
  schemaVersion: '1.0.0',
  updatedAt: '2026-01-01T00:00:00Z',
  badges: [
    {
      id: 'ph',
      name: 'Product Hunt',
      enabled: true,
      renderType: 'image',
      imageUrl: 'https://producthunt.com/img.svg',
      linkUrl: 'https://producthunt.com',
    },
  ],
}

describe('validateConfig', () => {
  it('合法配置通过校验', () => {
    expect(() => validateConfig(validInput)).not.toThrow()
  })

  it('不支持的 schemaVersion 抛出错误', () => {
    expect(() =>
      validateConfig({ ...validInput, schemaVersion: '99.0.0' }),
    ).toThrow(ConfigValidationError)
  })

  it('imageUrl 不合法时抛出错误', () => {
    expect(() =>
      validateConfig({
        ...validInput,
        badges: [{ ...validInput.badges[0], imageUrl: 'not-a-url' }],
      }),
    ).toThrow(ConfigValidationError)
  })

  it('重复 id 时抛出错误', () => {
    expect(() =>
      validateConfig({
        ...validInput,
        badges: [validInput.badges[0], { ...validInput.badges[0] }],
      }),
    ).toThrow(ConfigValidationError)
  })
})
```

---

## 24. CI 配置

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm -r exec tsc --noEmit

      - name: Lint
        run: pnpm -r run lint

      - name: Test
        run: pnpm -r run test

      - name: Build
        run: pnpm -r run build
```

### `.github/workflows/config-lint.yml`

> 用于校验 `configs/` 目录下每次配置变更是否符合 schema。

```yaml
name: Config Lint

on:
  pull_request:
    paths:
      - 'configs/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Validate config JSON files
        run: node scripts/validate-configs.mjs
```

### `scripts/validate-configs.mjs`

```javascript
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const schema = JSON.parse(
  readFileSync('configs/schema/badge-config.schema.json', 'utf8'),
)
const validate = ajv.compile(schema)

const examplesDir = 'configs/examples'
const files = readdirSync(examplesDir).filter((f) => f.endsWith('.json'))

let hasError = false

for (const file of files) {
  const filePath = join(examplesDir, file)
  const data = JSON.parse(readFileSync(filePath, 'utf8'))

  if (!validate(data)) {
    console.error(`❌ ${file}:`, validate.errors)
    hasError = true
  } else {
    console.log(`✅ ${file}`)
  }
}

if (hasError) process.exit(1)
```

---

## 25. SSR 兼容性说明

以下 Browser API 在 Node.js / Edge Runtime 等 SSR 环境中不可用。SDK 已在每处调用前做了环境检测，但实现者需要理解这些边界：

| API | 影响模块 | SDK 处理方式 |
|-----|----------|-------------|
| `document` | `mount`, `renderBadges` | `mount` 中 `document.readyState` 检查；React adapter 中 `useEffect` 仅在客户端执行 |
| `localStorage` | `cache.ts` | `isBrowser()` 检查，不可用时降级到 `memoryCache` |
| `window` | `script/global.ts` | `typeof window !== 'undefined'` 检查 |
| `fetch` | `fetchConfig.ts` | Node 18+ 原生支持；旧版本需 polyfill（不在 SDK 内做） |
| `AbortController` | `fetchConfig.ts` | Node 15+ 原生支持；旧版本需 polyfill |

**Next.js 使用者**：`@link-exchange/react` 中的 `LinkExchange` 组件必须在 `'use client'` 文件中使用，不可作为 Server Component 直接渲染。

---

## 26. 配置发布流程

### 26.1 发布规则

每次修改配置文件（`configs/` 下的 JSON）必须遵守以下规则：

1. `configVersion` 必须自增（字符串递增整数，如 `"1"` → `"2"`）
2. `updatedAt` 更新为当前 ISO 时间
3. 所有 badge 的 `id` 全局唯一
4. 所有 URL 必须是合法 `https://` 开头的地址
5. 提交前本地运行 `node scripts/validate-configs.mjs` 通过

### 26.2 发布流程

```
编辑 JSON 配置
  ↓
本地运行 schema lint：node scripts/validate-configs.mjs
  ↓
提交 PR → CI 自动执行 config-lint workflow
  ↓
发布到 staging CDN：https://staging-cdn.example.com/badges/basic.json
  ↓
使用 staging 示例页面验证 badge 展示正确
  ↓
合并 PR → 发布到 production CDN：https://cdn.example.com/badges/basic.json
  ↓
观察 telemetry（config_fetch_success 事件中的 configVersion 是否已更新）
```

### 26.3 回滚

保留最近 10 个历史版本的配置文件（以 `configVersion` 命名存档），需要回滚时将目标版本的内容覆盖 `basic.json` 并发布（configVersion 依旧递增，不回退版本号）。

---

## 27. 样式覆盖说明（SDK 使用方）

SDK 仅输出最小化 class，不注入 `<style>` 标签，宿主可自由覆盖：

```css
/* 容器：flex 横排，间距 8px */
.link-exchange-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* 单个 badge 链接 */
.link-exchange-item {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.link-exchange-item:hover {
  opacity: 0.8;
}

/* 图片 */
.link-exchange-image {
  display: block;
  max-width: 100%;
  height: auto;
}
```

---

## 28. MVP 开发拆解与交付顺序

### Phase 1：Core 协议冻结（优先）

交付：`packages/core` 完整实现，包含：
- `types/index.ts`（BadgeConfig、MountOptions、SDKEvent 等所有类型）
- `errors/index.ts`
- `constants/index.ts`
- `utils/hash.ts` + `utils/security.ts`
- `fetch/fetchConfig.ts`
- `validate/validateConfig.ts`
- `cache/cache.ts`
- `resolve/resolveBadges.ts`
- `render/renderBadges.ts`
- `telemetry/telemetry.ts`
- `mountElement.ts` + `mount.ts` + `index.ts`
- 单元测试全部通过

### Phase 2：React 与 Script Adapter

交付：
- `packages/react`：`LinkExchange` 组件，`useEffect` 依赖正确，有 cleanup
- `packages/script`：UMD 输出，`window.LinkExchange` 挂载
- `examples/html/`、`examples/react-vite/`、`examples/nextjs/` 均可运行

### Phase 3：配置发布链路

交付：
- `configs/schema/badge-config.schema.json`
- `configs/examples/basic.json`、`multi-site.json`
- `scripts/validate-configs.mjs`
- `.github/workflows/config-lint.yml`

### Phase 4：文档与接入指南

交付：
- `README.md`：安装、快速上手、API 参考
- `docs/sdk-api.md`：完整 API 文档
- `docs/config-schema.md`：配置字段说明
- `docs/operations.md`：发布、回滚、监控

---

## 29. 实现注意事项（避坑清单）

| 序号 | 问题 | 正确做法 |
|------|------|----------|
| 1 | React `useEffect` 依赖传整个 `options` 对象 | 只监听 `source, siteId, group, environment, locale` 等关键字段 |
| 2 | mount 无 cleanup，fetch 不可取消 | `mountElement` 返回 `{ unmount }`, 内含 `AbortController.abort()` |
| 3 | badge_click 未打通到 renderBadges | `renderBadges` 接收 `emit` 参数，在 click handler 中调用 |
| 4 | imageUrl 类型是 optional | 使用 discriminated union，`renderType='image'` 时 `imageUrl` 为必填 |
| 5 | hash 函数未定义就引用 | `utils/hash.ts` 实现 djb2，无外部依赖 |
| 6 | localStorage.setItem 在隐私模式会抛异常 | try/catch 包裹，降级到 `memoryCache` |
| 7 | SSR 环境访问 document / localStorage | `isBrowser()` 检查，useEffect 客户端保护 |
| 8 | 缓存策略语义不清 | 明确为 **cache-first**：TTL 内不发请求；过期后请求失败用 stale 兜底 |
| 9 | configVersion 使用日期字符串 | 改为自增整数字符串，便于版本大小比较 |
| 10 | `<head>` 中 script 引入，DOM 未就绪 | `mount` 内部检测 `document.readyState === 'loading'`，自动等待 DOMContentLoaded |
| 11 | `packages/shared` 职责不明 | 删除 shared 包，类型统一放在 `@link-exchange/core` 导出 |
| 12 | 重复渲染（React 重渲染时 DOM 累积） | `renderBadges` 每次调用前 `target.innerHTML = ''` 清空 |

---

## 30. 最终结论

本项目按照**平台能力**（而非单一组件）建设。推荐的最终工程形态：

- `@link-exchange/core`：稳定的 API 契约，framework-agnostic
- `@link-exchange/react`：React 18+ 适配层
- `@link-exchange/script`：CDN UMD 包，供非工程化场景接入
- 版本化 JSON 配置源（静态 CDN）
- 基础治理：schema lint + CI 校验 + 回滚机制 + telemetry 上报

**项目长期稳定的前提**：

1. `MountOptions` 和 `BadgeConfig` schema 保持向后兼容
2. `configVersion` 每次发布必须递增
3. 缓存策略保持 cache-first，TTL 不低于 5 分钟
4. 所有外部接入方调用 `unmount()` 进行清理
5. telemetry 上报不影响主流程（catch 内部错误）

---

*Link Exchange Badge Delivery SDK — Engineering Spec v2.0*
*文档最后更新：2026-03-20*
