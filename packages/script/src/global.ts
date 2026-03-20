import { mount, mountElement } from '@link-exchange/core'

/**
 * 挂载到全局 window 对象，供 CDN <script> 引入方式使用。
 *
 * 使用方式：
 *   <script src="https://cdn.example.com/link-exchange.min.js"></script>
 *   <script>
 *     window.LinkExchange.mount('#footer', { source: '...' })
 *   </script>
 */
if (typeof window !== 'undefined') {
  ;(
    window as typeof window & {
      LinkExchange: { mount: typeof mount; mountElement: typeof mountElement }
    }
  ).LinkExchange = { mount, mountElement }
}
