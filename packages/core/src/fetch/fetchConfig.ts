import { ConfigFetchError } from '../errors'
import { DEFAULT_FETCH_TIMEOUT_MS } from '../constants'

/**
 * 带超时控制的 JSON 配置拉取函数。
 *
 * - 使用 AbortController 实现超时取消
 * - 网络错误、非 2xx 状态码、超时均抛出 ConfigFetchError
 * - 返回值为 unknown，由 validateConfig 负责类型校验
 */
export async function fetchConfig(
  source: string,
  timeoutMs: number = DEFAULT_FETCH_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<unknown> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // 若外部传入了 signal（来自 mount 的 cleanup 逻辑），监听它的中止
  signal?.addEventListener('abort', () => controller.abort())

  try {
    const response = await fetch(source, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ConfigFetchError(
        source,
        `HTTP ${response.status} ${response.statusText}`,
      )
    }

    return await response.json()
  } catch (err) {
    if (err instanceof ConfigFetchError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new ConfigFetchError(source, `Request timed out after ${timeoutMs}ms`)
    }
    throw new ConfigFetchError(source, (err as Error).message)
  } finally {
    clearTimeout(timeoutId)
  }
}
