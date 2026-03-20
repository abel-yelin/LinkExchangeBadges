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
