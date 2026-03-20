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
