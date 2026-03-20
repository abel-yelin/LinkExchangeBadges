import { useEffect, useRef, type JSX } from 'react'
import { mountElement, type MountResult } from '@link-exchange/core'
import type { MountOptions } from '@link-exchange/core'

export type LinkExchangeProps = MountOptions & {
  /**
   * 容器标签名，默认 'div'。
   * 传入 'footer' / 'section' 等语义化标签可改善 accessibility。
   */
  as?: keyof JSX.IntrinsicElements
}

export function LinkExchange({
  as: Tag = 'div',
  ...options
}: LinkExchangeProps) {
  const ref = useRef<HTMLElement>(null)
  const mountResultRef = useRef<MountResult | null>(null)

  useEffect(() => {
    if (!ref.current) return

    let isMounted = true

    void mountElement(ref.current, options).then((result) => {
      if (!isMounted) {
        // 组件在 fetch 完成前已卸载，立即清理
        result.unmount()
        return
      }
      mountResultRef.current = result
    })

    return () => {
      isMounted = false
      // 清理：取消进行中的 fetch + 解绑 click 事件监听器
      mountResultRef.current?.unmount()
      mountResultRef.current = null
    }
  }, [
    // 只监听真正影响渲染结果的字段，避免 options 对象引用变化触发无限重渲染
    options.source,
    options.siteId,
    options.group,
    options.environment,
    options.locale,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ])

  // Tag 作为泛型标签使用时需要类型断言
  return <Tag ref={ref as React.Ref<HTMLDivElement>} />
}
