# 缓存策略

Link Exchange Badges SDK 内置了智能缓存系统，可以显著提升性能和用户体验。

## 缓存机制

### 工作原理

SDK 使用以下缓存策略：

1. **Cache-First**：优先使用缓存
2. **TTL 验证**：检查缓存是否过期
3. **Stale Fallback**：网络失败时使用过期缓存
4. **LocalStorage**：使用浏览器 localStorage 存储

### 缓存流程

```
┌─────────────────┐
│   发起请求       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  检查本地缓存    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ 命中    │ │ 未命中 │
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌──────────┐
│检查TTL │ │ 发起网络请求│
└───┬────┘ └────┬─────┘
    │            │
    ▼            ▼
┌────────┐  ┌────────┐
│ 有效   │  │ 成功   │
└───┬────┘  └────┬───┘
    │            │
    └────┬───────┘
         ▼
    ┌────────┐
    │ 渲染徽章│
    └────────┘
```

## 基础配置

### 启用缓存

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true
  }
})
```

### 设置缓存时间

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true,
    ttlMs: 30 * 60 * 1000 // 30 分钟
  }
})
```

### 禁用缓存

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: false
  }
})
```

## 环境配置

### 开发环境

```javascript
const devCacheConfig = {
  enabled: true,
  ttlMs: 1 * 60 * 1000 // 1 分钟，便于调试
}
```

### 生产环境

```javascript
const prodCacheConfig = {
  enabled: true,
  ttlMs: 60 * 60 * 1000 // 1 小时，提升性能
}
```

## 缓存键

### 键的生成规则

缓存键基于配置 URL 生成：

```javascript
const cacheKey = buildCacheKey('https://cdn.example.com/badges.json')
// 结果: 'link-exchange:https://cdn.example.com/badges.json'
```

### 版本化缓存

通过修改 URL 实现版本控制：

```javascript
// 版本 1
source: 'https://cdn.example.com/badges.v1.json'

// 版本 2
source: 'https://cdn.example.com/badges.v2.json'
```

## 缓存事件

### cache_hit

缓存命中时触发：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'cache_hit') {
        console.log('使用缓存:', event.configVersion)
      }
    }
  }
})
```

### cache_miss

缓存未命中时触发：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'cache_miss') {
        console.log('缓存未命中，发起网络请求')
      }
    }
  }
})
```

### cache_stale_used

使用过期缓存时触发：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'cache_stale_used') {
        console.log('网络失败，使用过期缓存:', event.configVersion)
      }
    }
  }
})
```

## 手动缓存管理

### 读取缓存

```javascript
import { readCache, buildCacheKey } from '@link-exchange/core'

const key = buildCacheKey('https://cdn.example.com/badges.json')
const cached = readCache(key)

if (cached) {
  console.log('缓存版本:', cached.configVersion)
  console.log('缓存时间:', new Date(cached.cachedAt))
}
```

### 写入缓存

```javascript
import { writeCache, buildCacheKey } from '@link-exchange/core'

const key = buildCacheKey('https://cdn.example.com/badges.json')

writeCache(key, {
  cachedAt: Date.now(),
  configVersion: '2',
  data: config
})
```

### 清除缓存

```javascript
import { clearCache, buildCacheKey } from '@link-exchange/core'

const key = buildCacheKey('https://cdn.example.com/badges.json')
clearCache(key)
```

### 检查缓存有效性

```javascript
import { isCacheValid, readCache, buildCacheKey } from '@link-exchange/core'

const key = buildCacheKey('https://cdn.example.com/badges.json')
const cached = readCache(key)

if (cached && isCacheValid(cached, 30 * 60 * 1000)) {
  console.log('缓存有效')
} else {
  console.log('缓存无效或过期')
}
```

## 高级用法

### 自定义缓存存储

```javascript
class CustomCacheStorage {
  constructor() {
    this.cache = new Map()
  }

  getItem(key) {
    const item = this.cache.get(key)
    if (item) {
      return JSON.stringify(item)
    }
    return null
  }

  setItem(key, value) {
    this.cache.set(key, JSON.parse(value))
  }

  removeItem(key) {
    this.cache.delete(key)
  }
}

const customStorage = new CustomCacheStorage()
```

### 缓存预热

```javascript
// 页面加载时预热缓存
async function warmupCache() {
  try {
    const response = await fetch('https://cdn.example.com/badges.json')
    const config = await response.json()

    const key = buildCacheKey('https://cdn.example.com/badges.json')
    writeCache(key, {
      cachedAt: Date.now(),
      configVersion: config.configVersion,
      data: config
    })

    console.log('缓存预热完成')
  } catch (error) {
    console.error('缓存预热失败:', error)
  }
}
```

### 条件缓存

```javascript
function shouldUseCache() {
  // 仅在快速网络时使用缓存
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

  if (connection) {
    return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g'
  }

  return true
}

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: shouldUseCache(),
    ttlMs: 30 * 60 * 1000
  }
})
```

## 性能优化

### Service Worker 缓存

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('badges.json')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      })
    )
  }
})
```

### 预缓存配置

```html
<link rel="preload" href="https://cdn.example.com/badges.json" as="fetch" crossorigin>
```

### 缓存统计

```javascript
let cacheHits = 0
let cacheMisses = 0

LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      if (event.type === 'cache_hit') {
        cacheHits++
      } else if (event.type === 'cache_miss') {
        cacheMisses++
      }

      const hitRate = cacheHits / (cacheHits + cacheMisses) * 100
      console.log(`缓存命中率: ${hitRate.toFixed(2)}%`)
    }
  }
})
```

## 故障处理

### 缓存损坏

```javascript
try {
  const cached = readCache(key)
  if (cached) {
    // 验证缓存数据
    if (!cached.data || !cached.configVersion) {
      throw new Error('Invalid cache data')
    }
  }
} catch (error) {
  console.error('缓存损坏，清除缓存:', error)
  clearCache(key)
}
```

### 存储空间不足

```javascript
function checkStorageAvailability() {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('存储空间不足')
      return false
    }
    return true
  }
}
```

## 最佳实践

### 1. 合理设置 TTL

```javascript
// 根据配置更新频率设置 TTL
const cacheTTL = {
  // 频繁更新的配置
  frequent: 5 * 60 * 1000,     // 5 分钟

  // 正常更新频率
  normal: 30 * 60 * 1000,      // 30 分钟

  // 很少更新的配置
  rare: 60 * 60 * 1000         // 1 小时
}
```

### 2. 版本管理

```javascript
// 使用查询参数实现版本控制
source: 'https://cdn.example.com/badges.json?v=2'
```

### 3. 监控缓存性能

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: (event) => {
      // 发送缓存指标到监控平台
      if (['cache_hit', 'cache_miss', 'cache_stale_used'].includes(event.type)) {
        analytics.track('cache_event', {
          type: event.type,
          configVersion: event.configVersion
        })
      }
    }
  }
})
```

### 4. 降级策略

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true,
    ttlMs: 30 * 60 * 1000
  },
  fallback: {
    snapshot: {
      // 离线时使用的快照配置
      configVersion: '1',
      schemaVersion: '1.0.0',
      updatedAt: new Date().toISOString(),
      badges: [/* ... */]
    }
  }
})
```

## 常见问题

### Q: 缓存存储在哪里？

A: 使用浏览器的 localStorage，键名为 `link-exchange:${url}`。

### Q: 缓存会占用多少空间？

A: 取决于配置大小，通常在几 KB 到几十 KB 之间。

### Q: 如何清除所有缓存？

A: 遍历 localStorage 并删除所有 `link-exchange:` 开头的键。

### Q: 缓存失败会怎样？

A: SDK 会尝试从网络获取配置，网络也失败时使用快照配置。

## 下一步

- [配置选项](/guide/configuration)
- [徽章规则](/guide/badge-rules)
- [API 参考](/api/core)
