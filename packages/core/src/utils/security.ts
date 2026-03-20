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
