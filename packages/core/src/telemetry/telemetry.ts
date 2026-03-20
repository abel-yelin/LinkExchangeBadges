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
