# 徽章规则

徽章规则引擎让你能够根据不同条件动态控制徽章的展示。

## 规则类型

### 1. 站点规则 (siteIds)

只在指定站点展示徽章：

```json
{
  "badges": [
    {
      "id": "special-partner",
      "name": "Special Partner",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Special-FF5722",
      "linkUrl": "https://example.com",
      "rules": {
        "siteIds": ["site-a", "site-b"]
      }
    }
  ]
}
```

使用：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'site-a' // 只显示 site-a 的徽章
})
```

### 2. 环境规则 (environments)

只在指定环境展示徽章：

```json
{
  "badges": [
    {
      "id": "test-badge",
      "name": "Test Badge",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Test-FFA000",
      "linkUrl": "https://example.com",
      "rules": {
        "environments": ["development", "staging"]
      }
    }
  ]
}
```

使用：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  environment: 'production' // 不显示测试徽章
})
```

### 3. 语言规则 (locales)

只在指定语言展示徽章：

```json
{
  "badges": [
    {
      "id": "cn-partner",
      "name": "中国合作伙伴",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/中国-FF5722",
      "linkUrl": "https://example.com",
      "rules": {
        "locales": ["zh-CN", "zh-TW"]
      }
    }
  ]
}
```

使用：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  locale: 'zh-CN' // 显示中文徽章
})
```

## 组合规则

可以组合多个规则（AND 逻辑）：

```json
{
  "badges": [
    {
      "id": "exclusive-badge",
      "name": "Exclusive Badge",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Exclusive-FF5722",
      "linkUrl": "https://example.com",
      "rules": {
        "siteIds": ["premium-site"],
        "environments": ["production"],
        "locales": ["en", "zh-CN"]
      }
    }
  ]
}
```

这个徽章只在同时满足以下条件时显示：
- 站点 ID 为 `premium-site`
- 环境为 `production`
- 语言为 `en` 或 `zh-CN`

## 规则优先级

规则按以下顺序评估：

1. **启用状态**：`enabled: false` 的徽章直接跳过
2. **分组过滤**：如果指定了 `group`，只匹配该分组的徽章
3. **站点规则**：匹配 `siteIds`
4. **环境规则**：匹配 `environments`
5. **语言规则**：匹配 `locales`
6. **优先级排序**：按 `priority` 降序排列

## 无规则徽章

没有规则或规则字段为空的徽章会始终显示：

```json
{
  "badges": [
    {
      "id": "universal-badge",
      "name": "Universal Badge",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Universal-4CAF50",
      "linkUrl": "https://example.com"
      // 没有 rules 字段，始终显示
    }
  ]
}
```

## 实际示例

### 1. 多站点徽章管理

```json
{
  "badges": [
    {
      "id": "github",
      "name": "GitHub",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/GitHub-100000",
      "linkUrl": "https://github.com"
      // 无规则，所有站点显示
    },
    {
      "id": "site-a-exclusive",
      "name": "Site A Exclusive",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Site_A-FF5722",
      "linkUrl": "https://example.com",
      "rules": {
        "siteIds": ["site-a"]
      }
    },
    {
      "id": "site-b-exclusive",
      "name": "Site B Exclusive",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Site_B-2196F3",
      "linkUrl": "https://example.com",
      "rules": {
        "siteIds": ["site-b"]
      }
    }
  ]
}
```

### 2. 环境特定徽章

```json
{
  "badges": [
    {
      "id": "dev-badge",
      "name": "Development",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Dev-FFA000",
      "linkUrl": "https://example.com",
      "rules": {
        "environments": ["development"]
      }
    },
    {
      "id": "production-badge",
      "name": "Production",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Prod-4CAF50",
      "linkUrl": "https://example.com",
      "rules": {
        "environments": ["production"]
      }
    }
  ]
}
```

### 3. 本地化徽章

```json
{
  "badges": [
    {
      "id": "partner-en",
      "name": "Partner",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/Partner-4CAF50",
      "linkUrl": "https://example.com/en",
      "rules": {
        "locales": ["en"]
      }
    },
    {
      "id": "partner-zh",
      "name": "合作伙伴",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/合作伙伴-FF5722",
      "linkUrl": "https://example.com/zh",
      "rules": {
        "locales": ["zh-CN", "zh-TW"]
      }
    }
  ]
}
```

## 规则调试

### 启用详细日志

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-site',
  environment: 'production',
  locale: 'zh-CN',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'render_success') {
        console.log(`渲染了 ${event.count} 个徽章`)
      }
    }
  }
})
```

### 手动测试规则

```javascript
import { resolveBadges } from '@link-exchange/core'

const config = await fetchConfig('https://cdn.example.com/badges.json')

const filteredBadges = resolveBadges(config, {
  siteId: 'my-site',
  environment: 'production',
  locale: 'zh-CN'
})

console.log('匹配的徽章:', filteredBadges)
```

## 最佳实践

### 1. 使用有意义的 ID

```json
{
  "badges": [
    {
      "id": "partner-github-production",
      // 清晰的 ID，便于理解和调试
    }
  ]
}
```

### 2. 合理使用优先级

```json
{
  "badges": [
    {
      "id": "important-partner",
      "priority": 100,
      // 高优先级，排在前面
    },
    {
      "id": "normal-partner",
      "priority": 50,
      // 普通优先级
    }
  ]
}
```

### 3. 分组管理

```json
{
  "badges": [
    {
      "id": "tech-github",
      "group": "technologies",
      // 技术栈组
    },
    {
      "id": "partner-microsoft",
      "group": "partners",
      // 合作伙伴组
    }
  ]
}
```

### 4. 使用元数据

```json
{
  "badges": [
    {
      "id": "special-badge",
      "metadata": {
        "campaign": "summer-2024",
        "expiry": "2024-09-01",
        "owner": "marketing-team"
      }
    }
  ]
}
```

## 常见问题

### Q: 规则是 AND 还是 OR 逻辑？

A: 规则字段之间是 AND 逻辑，数组值之间是 OR 逻辑。

```json
{
  "rules": {
    "siteIds": ["site-a", "site-b"],  // OR
    "environments": ["production"]     // AND
  }
}
```

### Q: 如何让徽章在所有环境显示？

A: 不设置 `environments` 字段，或设置为空数组。

### Q: 规则匹配失败会怎样？

A: 该徽章会被跳过，不会显示。

## 下一步

- [配置选项](/guide/configuration)
- [缓存策略](/guide/caching)
- [API 参考](/api/core)
