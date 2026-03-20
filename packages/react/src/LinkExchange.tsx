import { useEffect, useRef } from 'react'
import { mountElement, type MountResult } from '@link-exchange/core'
import type { MountOptions } from '@link-exchange/core'

// React 类型导入
import type { HTMLAttributes } from 'react'

export type LinkExchangeProps = MountOptions & {
  /**
   * 容器标签名，默认 'div'。
   * 支持 HTML 元素标签如 'div', 'footer', 'section' 等。
   */
  as?: 'div' | 'footer' | 'section' | 'nav' | 'main' | 'article' | 'aside'
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
        result.unmount()
        return
      }
      mountResultRef.current = result
    })

    return () => {
      isMounted = false
      mountResultRef.current?.unmount()
      mountResultRef.current = null
    }
  }, [
    options.source,
    options.siteId,
    options.group,
    options.environment,
    options.locale,
  ])

  // 使用 any 类型避免复杂的泛型推断问题
  return <Tag ref={ref as any} />
}
