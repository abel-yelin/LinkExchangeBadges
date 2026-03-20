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
      if (!b.rules?.siteIds || b.rules.siteIds.length === 0)
        return true // 无限制，全部生效
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
