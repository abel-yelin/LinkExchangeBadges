import { LinkExchange } from '@link-exchange/react'
import './Footer.css'

function Footer() {
  return (
    <LinkExchange
      as="footer"
      source="https://example.com/badges.json"
      siteId="react-vite-example-footer"
      environment="production"
      locale="en"
      className="link-exchange-footer"
      cache={{
        enabled: true,
        ttlMs: 30 * 60 * 1000, // 30 minutes
      }}
      security={{
        allowedLinkDomains: ['example.com', 'trusted-site.com'],
        allowedImageDomains: ['cdn.example.com', 'images.example.com'],
      }}
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          console.log('[LinkExchange Telemetry]', event.type, event)
        },
      }}
      fetchTimeoutMs={5000}
    />
  )
}

export default Footer
