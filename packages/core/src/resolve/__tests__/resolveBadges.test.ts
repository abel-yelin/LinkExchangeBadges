import { describe, it, expect } from 'vitest'
import { resolveBadges } from '../resolveBadges'
import type { BadgeConfig } from '../../types'

const makeConfig = (
  overrides: Partial<BadgeConfig['badges'][number]>[] = [],
): BadgeConfig => ({
  configVersion: '1',
  schemaVersion: '1.0.0',
  updatedAt: '2026-01-01T00:00:00Z',
  badges: overrides.map((o, i) => ({
    id: `badge-${i}`,
    name: `Badge ${i}`,
    enabled: true,
    priority: 0,
    renderType: 'image' as const,
    imageUrl: 'https://example.com/img.svg',
    linkUrl: 'https://example.com',
    target: '_blank' as const,
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
    const config = makeConfig([
      { priority: 10 },
      { priority: 50 },
      { priority: 30 },
    ])
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
