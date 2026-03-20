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
  imageUrl: z.string().url(), // renderType=image 时 imageUrl 必填
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
