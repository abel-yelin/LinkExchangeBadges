# Next.js 集成指南

本指南详细介绍如何在 Next.js 项目中集成 Link Exchange Badges SDK。

## 安装

```bash
npm install @link-exchange/react
```

## App Router (Next.js 14+)

### 1. 创建客户端组件

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

### 2. 在页面中使用

```tsx
// app/page.tsx
import { Badges } from '@/components/Badges'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Link Exchange Badges
        </h1>
        <Badges />
      </div>
    </main>
  )
}
```

### 3. 环境变量配置

```bash
# .env.local
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
NEXT_PUBLIC_SITE_ID=my-nextjs-app
NEXT_PUBLIC_LOCALE=en
```

## Pages Router (Next.js 12/13)

### 1. 创建客户端组件

```tsx
// components/Badges.tsx
'use client'

import { useEffect, useRef } from 'react'
import { mount } from '@link-exchange/core'

export function Badges() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initBadges = async () => {
      try {
        const result = await mount(containerRef.current, {
          source: process.env.NEXT_PUBLIC_BADGES_URL!,
          siteId: 'my-nextjs-app'
        })
        mountRef.current = result
      } catch (error) {
        console.error('Failed to mount badges:', error)
      }
    }

    initBadges()

    return () => {
      mountRef.current?.unmount()
    }
  }, [])

  return <div ref={containerRef} />
}
```

### 2. 在页面中使用

```tsx
// pages/index.tsx
import { Badges } from '@/components/Badges'

export default function Home() {
  return (
    <div>
      <h1>我的网站</h1>
      <Badges />
    </div>
  )
}
```

## 高级配置

### 类型安全配置

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

  return <LinkExchange {...config} />
}
```

### 智能组件

```tsx
// components/SmartBadges.tsx
'use client'

import { useMemo } from 'react'
import { LinkExchange } from '@link-exchange/react'

interface SmartBadgesProps {
  group?: string
  locale?: string
}

export function SmartBadges({ group, locale }: SmartBadgesProps) {
  const props = useMemo(() => {
    const isProd = process.env.NODE_ENV === 'production'

    return {
      source: process.env.NEXT_PUBLIC_BADGES_URL!,
      siteId: process.env.NEXT_PUBLIC_SITE_ID!,
      environment: process.env.NODE_ENV as 'development' | 'production',
      group,
      locale,
      cache: {
        enabled: isProd,
        ttlMs: isProd ? 30 * 60 * 1000 : 0
      },
      security: isProd ? {
        allowedLinkDomains: ['github.com', 'npmjs.com', 'vercel.com'],
        allowedImageDomains: ['img.shields.io', 'github.com']
      } : undefined,
      telemetry: {
        enabled: true,
        onEvent: (event: any) => {
          console.log('[Badges]', event.type, event)

          // 发送到 Vercel Analytics
          if (window.va) {
            window.va('event', {
              name: event.type,
              data: event
            })
          }
        }
      }
    }
  }, [group, locale])

  return <LinkExchange {...props} />
}
```

## 遥测集成

### Vercel Analytics

```tsx
// components/BadgesWithAnalytics.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'
import { useReportWebVitals } from 'next/web-vitals'

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

### Google Analytics

```tsx
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export function pageview(path: string) {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: path,
  })
}

// components/Badges.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'
import { GA_TRACKING_ID } from '@/lib/gtag'

export function Badges() {
  return (
    <LinkExchange
      source={process.env.NEXT_PUBLIC_BADGES_URL!}
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          if (window.gtag) {
            gtag('event', event.type, {
              event_category: 'badges',
              event_label: event.type,
              ...event
            })
          }
        }
      }}
    />
  )
}
```

## 动态导入

### 减少初始加载体积

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
      <Suspense fallback={<div>Loading...</div>}>
        <Badges />
      </Suspense>
    </main>
  )
}
```

## 错误处理

### 错误边界

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

### 组件错误处理

```tsx
// components/BadgesWithErrorBoundary.tsx
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

export function SafeBadges() {
  return (
    <BadgesErrorBoundary fallback={<div>徽章暂时无法显示</div>}>
      <LinkExchange
        source={process.env.NEXT_PUBLIC_BADGES_URL!}
      />
    </BadgesErrorBoundary>
  )
}
```

## 服务端数据结合

### 获取服务端配置

```tsx
// app/page.tsx
async function getBadgesData() {
  const res = await fetch(`${process.env.API_URL}/badges/config`, {
    next: { revalidate: 3600 }
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
      <SmartBadges
        group={badgesData.defaultGroup}
        locale={badgesData.locale}
      />
    </main>
  )
}
```

## 布局集成

### 根布局

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
            <SmartBadges group="footer" />
          </div>
        </footer>
      </body>
    </html>
  )
}
```

### 中间件集成

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 添加自定义头
  const response = NextResponse.next()

  // 设置站点 ID
  response.headers.set('x-site-id', 'my-nextjs-app')

  return response
}
```

## 样式集成

### Tailwind CSS

```tsx
// components/BadgesSection.tsx
'use client'

import { LinkExchange } from '@link-exchange/react'

export function BadgesSection() {
  return (
    <section className="p-5 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">合作伙伴</h2>
      <div className="flex gap-4 flex-wrap">
        <LinkExchange
          source={process.env.NEXT_PUBLIC_BADGES_URL!}
          group="partners"
        />
      </div>
    </section>
  )
}
```

### CSS Modules

```tsx
// components/BadgesSection.module.css
.section {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.title {
  color: #667eea;
  margin-bottom: 15px;
}

// components/BadgesSection.tsx
'use client'

import styles from './BadgesSection.module.css'
import { LinkExchange } from '@link-exchange/react'

export function BadgesSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>合作伙伴</h2>
      <LinkExchange
        source={process.env.NEXT_PUBLIC_BADGES_URL!}
      />
    </section>
  )
}
```

## 性能优化

### 预加载

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.example.com" />
        <link rel="dns-prefetch" href="https://cdn.example.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 图片优化配置

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      }
    ]
  }
}

module.exports = nextConfig
```

## 部署配置

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 环境变量

在 Vercel 项目设置中添加：

```bash
NEXT_PUBLIC_BADGES_URL=https://cdn.example.com/badges.json
NEXT_PUBLIC_SITE_ID=my-nextjs-app
NEXT_PUBLIC_LOCALE=en
```

### 构建优化

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,

  experimental: {
    optimizePackageImports: ['@link-exchange/react']
  }
}

module.exports = nextConfig
```

## 最佳实践

### 1. 组件分层

```tsx
// app/page.tsx - 页面层
import { BadgesSection } from '@/components/BadgesSection'

export default function Home() {
  return (
    <main>
      <BadgesSection group="partners" />
    </main>
  )
}

// components/BadgesSection.tsx - 布局层
import { SmartBadges } from './SmartBadges'

export function BadgesSection({ group }: { group: string }) {
  return (
    <section>
      <h2>合作伙伴</h2>
      <SmartBadges group={group} />
    </section>
  )
}

// components/SmartBadges.tsx - 逻辑层
'use client'

import { LinkExchange } from '@link-exchange/react'
import { getBadgesConfig } from '@/lib/badges-config'

export function SmartBadges({ group }: { group?: string }) {
  const config = getBadgesConfig()
  return <LinkExchange {...config} group={group} />
}
```

### 2. 配置管理

```tsx
// config/badges.ts
export const badgesConfig = {
  development: {
    source: 'http://localhost:8080/badges.json',
    cache: { enabled: false }
  },
  production: {
    source: 'https://cdn.example.com/badges.json',
    cache: { enabled: true, ttlMs: 1800000 }
  }
}

export function getBadgesConfig() {
  const env = process.env.NODE_ENV as 'development' | 'production'
  return badgesConfig[env]
}
```

### 3. 类型安全

```tsx
// types/badges.ts
export interface BadgesConfig {
  source: string
  siteId: string
  environment: 'development' | 'production'
  locale?: string
}

// lib/badges-config.ts
import type { BadgesConfig } from '@/types/badges'

export function getBadgesConfig(): BadgesConfig {
  return {
    source: process.env.NEXT_PUBLIC_BADGES_URL!,
    siteId: process.env.NEXT_PUBLIC_SITE_ID!,
    environment: process.env.NODE_ENV as 'development' | 'production'
  }
}
```

## 常见问题

### Q: 水合错误？

确保使用 `'use client'` 指令。

### Q: 环境变量未定义？

确保变量名以 `NEXT_PUBLIC_` 开头。

### Q: 构建失败？

检查 TypeScript 配置和类型定义。

## 下一步

- [React 集成](/guide/react-integration)
- [HTML 集成](/guide/html-integration)
- [示例](/examples/nextjs)
