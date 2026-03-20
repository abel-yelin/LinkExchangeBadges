import { LinkExchange } from '@link-exchange/react'
import './Footer.css'

interface FooterProps {
  useLocalServer?: boolean
}

function Footer({ useLocalServer = false }: FooterProps) {
  // 配置
  const LOCAL_SERVER_URL = 'http://localhost:8080/test-badges.json'
  const REMOTE_URL = 'https://example.com/badges.json'

  const source = useLocalServer ? LOCAL_SERVER_URL : REMOTE_URL

  // 安全配置 - 允许测试域名的图片
  const securityConfig = useLocalServer
    ? {
        allowedLinkDomains: ['github.com', 'npmjs.com', 'typescriptlang.org', 'opensource.org'],
        allowedImageDomains: ['img.shields.io', 'github.com'],
      }
    : {
        allowedLinkDomains: ['example.com', 'trusted-site.com'],
        allowedImageDomains: ['cdn.example.com', 'images.example.com'],
      }

  return (
    <LinkExchange
      as="footer"
      source={source}
      siteId="react-vite-example-footer"
      environment="development"
      locale="zh-CN"
      className="link-exchange-footer"
      cache={{
        enabled: true,
        ttlMs: useLocalServer ? 5 * 1000 : 30 * 60 * 1000, // 本地5秒，远程30分钟
      }}
      security={securityConfig}
      telemetry={{
        enabled: true,
        onEvent: (event) => {
          console.log('[Footer Telemetry]', event.type, event)
        },
      }}
      fetchTimeoutMs={5000}
    />
  )
}

export default Footer
