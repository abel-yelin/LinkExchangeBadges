# 使用案例展示

这里展示了使用 Link Exchange Badges SDK 的真实项目案例。

## 案例：SaaS 产品官网

### 场景描述
一个 B2B SaaS 产品需要在官网 Footer 展示以下徽章：
- Product Hunt 日榜排名
- 科技媒体报道（TechCrunch、WSJ）
- 安全认证（SOC2、GDPR）
- 合作伙伴 logo（AWS、Stripe）

### 实现方式

```tsx
import { LinkExchange } from '@link-exchange/react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-white text-sm font-semibold mb-4">
          Trusted by leading companies
        </h3>
        <LinkExchange
          source="https://cdn.example.com/badges.json"
          siteId="saas-landing"
          environment={process.env.NODE_ENV}
          group="trust-badges"
          className="flex gap-6 items-center flex-wrap"
          cache={{ enabled: true, ttlMs: 60 * 60 * 1000 }}
        />
      </div>
    </footer>
  )
}
```

### 配置文件

```json
{
  "configVersion": "1",
  "schemaVersion": "1.0.0",
  "updatedAt": "2026-03-20T10:00:00Z",
  "badges": [
    {
      "id": "producthunt-1",
      "name": "Product Hunt #1",
      "enabled": true,
      "group": "trust-badges",
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=123",
      "linkUrl": "https://producthunt.com/posts/your-product",
      "alt": "#1 Product of the Day",
      "width": 200,
      "height": 54
    },
    {
      "id": "techcrunch",
      "name": "Featured on TechCrunch",
      "enabled": true,
      "group": "trust-badges",
      "priority": 90,
      "renderType": "image",
      "imageUrl": "https://example.com/badges/techcrunch.svg",
      "linkUrl": "https://techcrunch.com/article",
      "alt": "Featured on TechCrunch",
      "width": 180,
      "height": 50
    },
    {
      "id": "soc2",
      "name": "SOC2 Compliant",
      "enabled": true,
      "group": "trust-badges",
      "priority": 80,
      "renderType": "image",
      "imageUrl": "https://example.com/badges/soc2.svg",
      "linkUrl": "/security",
      "alt": "SOC2 Type II Compliant",
      "width": 80,
      "height": 80
    }
  ]
}
```

---

## 案例：多语言电商网站

### 场景描述
一个面向全球的电商平台，需要根据用户地区展示不同的支付方式徽章：
- 中国用户：显示支付宝、微信支付
- 欧美用户：显示 Visa、Mastercard、PayPal
- 东南亚用户：显示 GrabPay、GoPay

### 实现方式

```tsx
import { LinkExchange } from '@link-exchange/react'
import { useLocale } from 'next-intl'

export default function PaymentBadges() {
  const locale = useLocale()

  return (
    <LinkExchange
      source="https://cdn.example.com/payment-badges.json"
      siteId="ecommerce-global"
      environment="production"
      locale={locale}
      className="flex gap-3"
      cache={{ enabled: true, ttlMs: 24 * 60 * 60 * 1000 }}
    />
  )
}
```

### 配置文件（按地区过滤）

```json
{
  "configVersion": "1",
  "schemaVersion": "1.0.0",
  "updatedAt": "2026-03-20T10:00:00Z",
  "badges": [
    {
      "id": "alipay",
      "name": "支付宝",
      "enabled": true,
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://example.com/badges/alipay.svg",
      "linkUrl": "/payment/alipay",
      "alt": "支持支付宝",
      "width": 80,
      "height": 30,
      "rules": {
        "locales": ["zh-CN", "zh-HK", "zh-TW"]
      }
    },
    {
      "id": "visa",
      "name": "Visa",
      "enabled": true,
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://example.com/badges/visa.svg",
      "linkUrl": "/payment/visa",
      "alt": "Visa",
      "width": 60,
      "height": 40,
      "rules": {
        "locales": ["en-US", "en-GB", "en-CA"]
      }
    },
    {
      "id": "grabpay",
      "name": "GrabPay",
      "enabled": true,
      "priority": 90,
      "renderType": "image",
      "imageUrl": "https://example.com/badges/grabpay.svg",
      "linkUrl": "/payment/grabpay",
      "alt": "GrabPay",
      "width": 80,
      "height": 30,
      "rules": {
        "locales": ["th-TH", "vi-VN", "id-ID"]
      }
    }
  ]
}
```

---

## 案例：开源项目 README

### 场景描述
一个开源项目需要在 GitHub README 中展示：
- npm 下载量
- GitHub Stars 徽章
- 赞助商 logo
- 构建状态

### 实现方式

由于 GitHub README 不支持 JavaScript，可以在项目文档网站使用 SDK：

```html
<!-- docs/sponsors.html -->
<!DOCTYPE html>
<html>
<head>
  <title>我们的赞助商</title>
</head>
<body>
  <h1>Sponsors</h1>
  <div id="sponsors"></div>

  <script src="https://cdn.example.com/link-exchange.umd.js"></script>
  <script>
    LinkExchange.mount('#sponsors', {
      source: 'https://cdn.example.com/sponsors.json',
      group: 'sponsors-tier-1',
      environment: 'production'
    })
  </script>
</body>
</html>
```

---

## 提交你的案例

如果你使用了 Link Exchange Badges SDK，欢迎提交你的案例！

请发送 PR 到本仓库，在 `docs-site/docs/showcase/` 目录下添加你的案例。
