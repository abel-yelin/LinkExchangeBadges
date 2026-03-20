'use client'

import { LinkExchange } from '@link-exchange/react'

const source = process.env.NEXT_PUBLIC_BADGES_SOURCE || ''
const siteId = 'nextjs-example'
const environment = process.env.NODE_ENV || 'development'

export default function Footer() {
  if (!source) {
    return (
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Link Exchange Badges - Configure NEXT_PUBLIC_BADGES_SOURCE to display badges</p>
        </div>
      </footer>
    )
  }

  return (
    <LinkExchange
      source={source}
      siteId={siteId}
      environment={environment}
      as="footer"
      cache={{
        enabled: true,
        ttlMs: 30 * 60 * 1000, // 30 minutes
      }}
      security={{
        allowedLinkDomains: ['example.com', 'trusted-site.com'],
        allowedImageDomains: ['cdn.example.com', 'images.example.com'],
      }}
      telemetry={{
        enabled: environment === 'production',
        onEvent: (event) => {
          if (environment === 'development') {
            console.log('[LinkExchange Telemetry]', event.type, event)
          }
        },
      }}
      fetchTimeoutMs={5000}
      className="bg-gray-100 border-t border-gray-200 mt-auto"
    />
  )
}
