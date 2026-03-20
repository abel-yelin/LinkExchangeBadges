import type { BadgeItem, MountOptions } from '../types'
import { CONTAINER_CLASS, ITEM_CLASS, IMAGE_CLASS } from '../constants'
import type { Emitter } from '../telemetry/telemetry'
import { RenderError } from '../errors'

export type RenderOptions = {
  className?: string
  security?: MountOptions['security']
  emit: Emitter
}

/**
 * 将 BadgeItem[] 渲染到目标 HTMLElement 中。
 *
 * 输出 DOM 结构：
 * <div class="link-exchange-container [className]">
 *   <a class="link-exchange-item" href="..." target="_blank" rel="noopener noreferrer">
 *     <img class="link-exchange-image" src="..." alt="..." width="250" height="54" loading="lazy" />
 *   </a>
 * </div>
 *
 * badge_click telemetry 在此处绑定，通过 emit 上报。
 * 返回一个 cleanup 函数，用于解绑所有事件监听器。
 */
export function renderBadges(
  target: HTMLElement,
  badges: BadgeItem[],
  options: RenderOptions,
): () => void {
  const { emit, className } = options

  // 清空容器（避免重复渲染累积）
  target.innerHTML = ''

  if (badges.length === 0) {
    emit({ type: 'render_empty' })
    return () => {}
  }

  const cleanupFns: Array<() => void> = []

  try {
    const container = document.createElement('div')
    container.className = [CONTAINER_CLASS, className].filter(Boolean).join(' ')

    for (const badge of badges) {
      const link = document.createElement('a')
      link.className = ITEM_CLASS
      link.setAttribute('href', badge.linkUrl)
      link.setAttribute('target', badge.target ?? '_blank')
      link.setAttribute('rel', badge.rel ?? 'noopener noreferrer')

      // badge_click 事件上报
      const clickHandler = () => {
        emit({ type: 'badge_click', badgeId: badge.id, linkUrl: badge.linkUrl })
      }
      link.addEventListener('click', clickHandler)
      cleanupFns.push(() => link.removeEventListener('click', clickHandler))

      if (badge.renderType === 'image') {
        const img = document.createElement('img')
        img.className = IMAGE_CLASS
        img.setAttribute('src', badge.imageUrl)
        img.setAttribute('alt', badge.alt ?? badge.name)
        img.setAttribute('loading', 'lazy')
        if (badge.width != null) img.setAttribute('width', String(badge.width))
        if (badge.height != null) img.setAttribute('height', String(badge.height))

        link.appendChild(img)
      }

      container.appendChild(link)
    }

    target.appendChild(container)

    emit({ type: 'render_success', count: badges.length })
  } catch (err) {
    const msg = (err as Error).message
    emit({ type: 'render_failed', error: msg })
    throw new RenderError(msg)
  }

  // 返回 cleanup 函数，解绑所有 click 监听器
  return () => {
    for (const fn of cleanupFns) fn()
  }
}
