'use client'

import { LinkExchange } from '@link-exchange/react'

const source = process.env.NEXT_PUBLIC_BADGES_SOURCE || 'http://localhost:8080/test-badges.json'
const siteId = 'nextjs-example'
const environment = process.env.NODE_ENV || 'development'

// 检测是否使用本地服务器
const isLocalServer = source.includes('localhost:8080')

export default function Footer() {
  // 开启日志
  console.log('%c🚀 Link Exchange Next.js App', 'color: #000; font-weight: bold; font-size: 14px')
  console.log('配置源:', source)
  console.log('环境:', environment)

  return (
    <LinkExchange
      source={source}
      siteId={siteId}
      environment={environment}
      as="footer"
      cache={{
        enabled: true,
        ttlMs: isLocalServer ? 5 * 1000 : 30 * 60 * 1000, // 本地5秒，远程30分钟
      }}
      security={
        isLocalServer
          ? {
              // 本地测试配置 - 允许 Shields.io 徽章
              allowedLinkDomains: ['github.com', 'npmjs.com', 'typescriptlang.org', 'opensource.org'],
              allowedImageDomains: ['img.shields.io', 'github.com'],
            }
          : {
              // 生产环境配置
              allowedLinkDomains: ['example.com', 'trusted-site.com'],
              allowedImageDomains: ['cdn.example.com', 'images.example.com'],
            }
      }
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          if (environment === 'development') {
            console.log('[Next.js Footer Telemetry]', event.type, event)
          }
        },
      }}
      fetchTimeoutMs={5000}
      className="bg-gray-100 border-t border-gray-200 mt-auto"
    />
  )
}
