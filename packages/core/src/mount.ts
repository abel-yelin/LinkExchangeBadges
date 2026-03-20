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
