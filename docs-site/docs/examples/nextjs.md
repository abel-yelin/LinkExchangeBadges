# Next.js 示例

本节展示如何在 Next.js 项目中使用 Link Exchange Badges SDK。

## App Router 示例 (Next.js 14+)

### 1. 安装依赖

```bash
npx create-next-app@latest my-app --typescript --tailwind
cd my-app
npm install @link-exchange/react
```

### 2. 创建客户端组件

由于 SDK 需要访问浏览器 API，必须使用 `'use client'` 指令：

```tsx
// components/Badges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL!}
      siteId="my-nextjs-app"
      environment={process.env.NODE_ENV as 'development' | 'production'}
    />
  )
}
```

### 3. 在页面中使用

```tsx
// app/page.tsx
import { Badges } from '@/components/Badges'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Link Exchange Badges
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Next.js 14 App Router Example
          </p>

          <section className="prose prose-slate">
            <h2>合作伙伴</h2>
            <Badges />
          </section>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4">技术栈</h3>
          <Badges />
        </div>
      </footer>
    </main>
  )
}
```

### 4. 环境变量配置

```bash
# .env.local
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
```

### 5. 类型安全配置

```tsx
// lib/badges-config.ts
export function getBadgesConfig() {
  return {
    source: process.env.NEXT_PUBLIC_BADGES_URL!,
    siteId: process.env.NEXT_PUBLIC_SITE_ID || 'my-nextjs-app',
    environment: (process.env.NODE_ENV || 'development') as 'development' | 'production',
    locale: process.env.NEXT_PUBLIC_LOCALE || 'en'
  }
}

// components/Badges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'
import { getBadgesConfig } from '@/lib/badges-config'

export function Badges() {
  const config = getBadgesConfig()

  return (
    <LinkExchange {...config} />
  )
}
```

## Pages Router 示例 (Next.js 12/13)

### 1. 创建客户端组件

```tsx
// components/Badges.tsx
import { useEffect } from 'react'
import { mount } from '@link-exchange/core'

export function Badges() {
  useEffect(() => {
    const initBadges = async () => {
      try {
        await mount('#badges', {
          source: process.env.NEXT_PUBLIC_BADGES_URL!,
          siteId: 'my-nextjs-app'
        })
      } catch (error) {
        console.error('Failed to mount badges:', error)
      }
    }

    initBadges()
  }, [])

  return <div id="badges" />
}
```

### 2. 在页面中使用

```tsx
// pages/index.tsx
import { Head } from 'next/head'
import { Badges } from '@/components/Badges'

export default function Home() {
  return (
    <>
      <Head>
        <title>Link Exchange Badges - Next.js</title>
      </Head>

      <main>
        <h1>我的网站</h1>
        <Badges />
      </main>
    </>
  )
}
```

## 完整配置示例

### 1. 创建配置文件

```tsx
// config/badges.ts
export const badgesConfig = {
  development: {
    source: process.env.NEXT_PUBLIC_BADGES_URL_DEV || 'http://localhost:8080/badges.json',
    cache: { enabled: false }
  },
  production: {
    source: process.env.NEXT_PUBLIC_BADGES_URL!,
    cache: {
      enabled: true,
      ttlMs: 30 * 60 * 1000
    },
    security: {
      allowedLinkDomains: ['github.com', 'npmjs.com', 'vercel.com'],
      allowedImageDomains: ['img.shields.io', 'github.com']
    }
  }
}

export function getBadgesConfig() {
  const env = process.env.NODE_ENV as 'development' | 'production'
  return badgesConfig[env]
}
```

### 2. 创建智能组件

```tsx
// components/SmartBadges.tsx
'use client'

import { useMemo } from 'react'
import { LinkExchange } from '@link-exchange/react'
import { getBadgesConfig } from '@/config/badges'

interface SmartBadgesProps {
  group?: string
  locale?: string
}

export function SmartBadges({ group, locale }: SmartBadgesProps) {
  const baseConfig = useMemo(() => getBadgesConfig(), [])

  const props = useMemo(() => ({
    ...baseConfig,
    group,
    locale,
    telemetry: {
      enabled: true,
      onEvent: (event: any) => {
        console.log('[Badges]', event.type, event)

        // 发送到分析平台
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', event.type, {
            event_category: 'badges',
            event_label: event.type
          })
        }
      }
    }
  }), [baseConfig, group, locale])

  return <LinkExchange {...props} />
}
```

### 3. 在布局中使用

```tsx
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { SmartBadges } from '@/components/SmartBadges'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Link Exchange Badges',
  description: 'Next.js App Router Example'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <footer className="border-t py-8 mt-16">
          <div className="max-w-4xl mx-auto px-4">
            <SmartBadges group="partners" />
          </div>
        </footer>
      </body>
    </html>
  )
}
```

## 动态导入示例

### 1. 使用动态导入减少初始加载体积

```tsx
// app/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Badges = dynamic(() => import('@/components/Badges'), {
  loading: () => <div>Loading badges...</div>,
  ssr: false
})

export default function Home() {
  return (
    <main>
      <h1>我的网站</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Badges />
      </Suspense>
    </main>
  )
}
```

### 2. 条件加载

```tsx
// components/Badges.tsx
'use client'

import { useEffect, useState } from 'react'
import { LinkExchange } from '@link-exchange/react'

export function Badges() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL!}
      siteId="my-nextjs-app"
    />
  )
}
```

## 与服务端数据结合

### 1. 获取服务端配置

```tsx
// app/page.tsx
import { SmartBadges } from '@/components/SmartBadges'

async function getBadgesData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/badges/config`, {
    next: { revalidate: 3600 } // 缓存 1 小时
  })

  if (!res.ok) {
    throw new Error('Failed to fetch badges config')
  }

  return res.json()
}

export default async function Home() {
  const badgesData = await getBadgesData()

  return (
    <main>
      <h1>我的网站</h1>

      <section>
        <h2>推荐徽章</h2>
        <SmartBadges
          group={badgesData.defaultGroup}
          locale={badgesData.locale}
        />
      </section>
    </main>
  )
}
```

## 错误处理

### 1. 创建错误边界

```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-lg font-semibold text-red-800">出错了</h2>
      <p className="text-red-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        重试
      </button>
    </div>
  )
}
```

### 2. 徽章组件错误处理

```tsx
// components/BadgesWithError.tsx
'use client'

import { Component, ReactNode } from 'react'
import { LinkExchange } from '@link-exchange/react'

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

class BadgesErrorBoundary extends Component<
  Props,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>徽章加载失败</div>
    }

    return this.props.children
  }
}

export function BadgesWithError() {
  return (
    <BadgesErrorBoundary fallback={<div>徽章暂时无法显示</div>}>
      <LinkExchange
        source={process.env.NEXT_PUBLIC_BADGES_URL!}
      />
    </BadgesErrorBoundary>
  )
}
```

## 性能优化

### 1. 使用 Vercel Analytics

```tsx
// components/BadgesWithAnalytics.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { LinkExchange } from '@link-exchange/react'

export function BadgesWithAnalytics() {
  useReportWebVitals((metric) => {
    console.log('[Web Vitals]', metric)
  })

  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL!}
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          // 发送到 Vercel Analytics
          if (window.va) {
            window.va('event', {
              name: event.type,
              data: event
            })
          }
        }
      }}
    />
  )
}
```

### 2. 使用 next/image 优化

```tsx
// components/OptimizedBadges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'
import Image from 'next/image'

export function OptimizedBadges() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL!}
      // 注意：目前 SDK 使用原生 img 标签
      // 未来版本可能支持自定义渲染器
    />
  )
}
```

## 测试

### 1. 单元测试

```tsx
// __tests__/Badges.test.tsx
import { render, screen } from '@testing-library/react'
import { Badges } from '@/components/Badges'

describe('Badges', () => {
  it('renders without crashing', () => {
    process.env.NEXT_PUBLIC_BADGES_URL = 'https://example.com/badges.json'

    render(<Badges />)

    // 验证组件渲染
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('uses correct props', () => {
    process.env.NEXT_PUBLIC_BADGES_URL = 'https://example.com/badges.json'

    const { container } = render(<Badges />)

    // 验证 props 传递
    // 具体验证逻辑取决于你的实现
  })
})
```

## 部署配置

### 1. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 2. 环境变量设置

在 Vercel 项目设置中添加：

```bash
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
NEXT_PUBLIC_SITE_ID=my-nextjs-app
NEXT_PUBLIC_LOCALE=en
```

### 3. 构建优化

```json
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化生产构建
  swcMinify: true,

  // 图片优化
  images: {
    domains: ['img.shields.io', 'github.com'],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['@link-exchange/react']
  }
}

module.exports = nextConfig
```

## 最佳实践

### 1. 使用客户端组件模式

```tsx
// app/badges/page.tsx
import { SmartBadges } from '@/components/SmartBadges'

export default function BadgesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">徽章展示</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">合作伙伴</h2>
          <SmartBadges group="partners" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">技术栈</h2>
          <SmartBadges group="technologies" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">认证</h2>
          <SmartBadges group="certifications" />
        </section>
      </div>
    </div>
  )
}
```

### 2. TypeScript 类型安全

```tsx
// types/badges.ts
export interface BadgesConfig {
  source: string
  siteId: string
  environment: 'development' | 'production'
  locale?: string
}

export function validateBadgesConfig(config: unknown): config is BadgesConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'source' in config &&
    'siteId' in config &&
    'environment' in config
  )
}

// components/Badges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'
import type { BadgesConfig } from '@/types/badges'
import { validateBadgesConfig } from '@/types/badges'

export function TypedBadges(config: BadgesConfig) {
  if (!validateBadgesConfig(config)) {
    throw new Error('Invalid badges config')
  }

  return <LinkExchange {...config} />
}
```

## 下一步

- [React 示例](/examples/react)
- [HTML 示例](/examples/html)
- [API 参考](/api/react)
