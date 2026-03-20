// 主要 API
export { mount } from './mount'
export { mountElement } from './mountElement'

// 可单独使用的子函数（供高级场景）
export { fetchConfig } from './fetch/fetchConfig'
export { validateConfig } from './validate/validateConfig'
export { resolveBadges } from './resolve/resolveBadges'
export { renderBadges } from './render/renderBadges'

// 缓存工具
export {
  buildCacheKey,
  readCache,
  writeCache,
  clearCache,
  isCacheValid,
} from './cache/cache'

// 类型
export type {
  BadgeItem,
  BadgeConfig,
  MountOptions,
  SDKEnvironment,
  SDKEvent,
  CachePayload,
} from './types'
export type { MountResult } from './mountElement'
export type { ResolveContext } from './resolve/resolveBadges'
export type { Emitter } from './telemetry/telemetry'

// 错误类型
export {
  SDKError,
  TargetNotFoundError,
  ConfigFetchError,
  ConfigValidationError,
  RenderError,
} from './errors'
