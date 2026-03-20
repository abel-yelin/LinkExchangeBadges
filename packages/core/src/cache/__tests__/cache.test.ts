import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildCacheKey,
  writeCache,
  readCache,
  isCacheValid,
  clearCache,
} from '../cache'
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

  beforeEach(() => {
    clearCache(key)
  })

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
