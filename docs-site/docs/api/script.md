# CDN 脚本 API

`@link-exchange/script` 提供 CDN 脚本，让你无需构建工具即可使用 Link Exchange Badges。

## 引入方式

### 通过 CDN 引入

```html
<script src="https://cdn.example.com/link-exchange.js"></script>
```

### 使用本地构建文件

```html
<script src="./path/to/link-exchange.umd.cjs"></script>
```

## 全局对象

脚本加载后，会在全局 `window` 对象上添加 `LinkExchange` 对象：

```typescript
window.LinkExchange = {
  mount: function,
  mountElement: function
}
```

## mount

通过 CSS 选择器查找容器并挂载徽章。

### 语法

```javascript
LinkExchange.mount(selector, options)
```

### 参数

- **selector** (string): CSS 选择器
- **options** (object): 配置选项

### 返回值

返回一个 Promise，解析为包含 `unmount` 方法的对象。

### 示例

```html
<footer id="badges"></footer>

<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json'
  }).then(result => {
    console.log('徽章已挂载')

    // 卸载徽章
    // result.unmount()
  })
</script>
```

## mountElement

直接在 DOM 元素上挂载徽章。

### 语法

```javascript
LinkExchange.mountElement(element, options)
```

### 参数

- **element** (HTMLElement): DOM 元素
- **options** (object): 配置选项

### 返回值

返回一个 Promise，解析为包含 `unmount` 方法的对象。

### 示例

```html
<footer id="badges"></footer>

<script>
  const element = document.getElementById('badges')

  LinkExchange.mountElement(element, {
    source: 'https://cdn.example.com/badges.json'
  }).then(result => {
    console.log('徽章已挂载')
  })
</script>
```

## 配置选项

### source (必填)

远程配置的 URL。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json'
})
```

### siteId (可选)

站点标识。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  siteId: 'my-website'
})
```

### group (可选)

徽章分组。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  group: 'partners'
})
```

### environment (可选)

运行环境。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  environment: 'production'
})
```

### locale (可选)

语言标识。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  locale: 'zh-CN'
})
```

### className (可选)

容器元素的 CSS 类名。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  className: 'my-badges'
})
```

### cache (可选)

缓存配置。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  cache: {
    enabled: true,
    ttlMs: 30 * 60 * 1000
  }
})
```

### security (可选)

安全配置。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  security: {
    allowedLinkDomains: ['github.com', 'npmjs.com'],
    allowedImageDomains: ['img.shields.io', 'github.com']
  }
})
```

### telemetry (可选)

遥测配置。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: function(event) {
      console.log('Badge event:', event)
    }
  }
})
```

### fetchTimeoutMs (可选)

请求超时时间（毫秒）。

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  fetchTimeoutMs: 10000
})
```

## 完整示例

### 基础示例

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <h1>我的网站</h1>
  <footer id="badges"></footer>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

### 完整配置示例

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <h1>我的网站</h1>
  <footer id="badges"></footer>

  <script>
    LinkExchange.mount('#badges', {
      // 基础配置
      source: 'https://cdn.example.com/badges.json',
      siteId: 'my-website',
      group: 'partners',
      environment: 'production',
      locale: 'zh-CN',
      className: 'partner-badges',

      // 缓存配置
      cache: {
        enabled: true,
        ttlMs: 30 * 60 * 1000
      },

      // 安全配置
      security: {
        allowedLinkDomains: ['github.com', 'npmjs.com'],
        allowedImageDomains: ['img.shields.io', 'github.com']
      },

      // 遥测配置
      telemetry: {
        enabled: true,
        onEvent: function(event) {
          console.log('[Telemetry]', event.type, event)

          // 发送到分析平台
          if (window.analytics) {
            analytics.track(event.type, event)
          }
        }
      },

      // 网络配置
      fetchTimeoutMs: 5000
    })
  </script>
</body>
</html>
```

### 多个容器示例

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <h1>我的网站</h1>

  <!-- 合作伙伴徽章 -->
  <section id="partners"></section>

  <!-- 技术栈徽章 -->
  <section id="technologies"></section>

  <script>
    // 挂载合作伙伴徽章
    LinkExchange.mount('#partners', {
      source: 'https://cdn.example.com/badges.json',
      group: 'partners'
    })

    // 挂载技术栈徽章
    LinkExchange.mount('#technologies', {
      source: 'https://cdn.example.com/badges.json',
      group: 'technologies'
    })
  </script>
</body>
</html>
```

### 错误处理示例

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <h1>我的网站</h1>
  <footer id="badges"></footer>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json',
      fallback: {
        silent: false,
        snapshot: {
          configVersion: '1',
          schemaVersion: '1.0.0',
          updatedAt: new Date().toISOString(),
          badges: [
            {
              id: 'github',
              name: 'GitHub',
              enabled: true,
              renderType: 'image',
              imageUrl: 'https://img.shields.io/badge/GitHub-100000?logo=github',
              linkUrl: 'https://github.com'
            }
          ]
        }
      }
    }).catch(error => {
      console.error('挂载失败:', error)
    })
  </script>
</body>
</html>
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 加载时机

### 在 <head> 中加载

SDK 会自动等待 DOM 准备就绪：

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.example.com/link-exchange.js"></script>
  <script>
    // DOM 未就绪也没关系
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</head>
<body>
  <footer id="badges"></footer>
</body>
</html>
```

### 在 <body> 底部加载

```html
<!DOCTYPE html>
<html>
<body>
  <h1>我的网站</h1>
  <footer id="badges"></footer>

  <script src="https://cdn.example.com/link-exchange.js"></script>
  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

### 异步加载

```html
<script>
  // 异步加载 SDK
  (function() {
    var script = document.createElement('script')
    script.src = 'https://cdn.example.com/link-exchange.js'
    script.async = true
    script.onload = function() {
      LinkExchange.mount('#badges', {
        source: 'https://cdn.example.com/badges.json'
      })
    }
    document.head.appendChild(script)
  })()
</script>
```

## 性能优化

### 使用 defer 属性

```html
<script src="https://cdn.example.com/link-exchange.js" defer></script>
```

### 预连接到 CDN

```html
<link rel="preconnect" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### 使用缓存

```html
<script src="https://cdn.example.com/link-exchange.js"></script>

<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json',
    cache: {
      enabled: true,
      ttlMs: 60 * 60 * 1000 // 1 小时
    }
  })
</script>
```

## 故障排查

### 脚本加载失败

检查 CDN URL 是否正确：

```html
<script>
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('link-exchange')) {
      console.error('SDK 加载失败:', event.message)
    }
  }, true)
</script>
```

### 容器未找到

SDK 会自动处理，但可以通过遥测监控：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: function(event) {
      if (event.type === 'target_not_found') {
        console.error('容器未找到:', event.selector)
      }
    }
  }
})
```

### 配置加载失败

检查配置 URL 和 CORS 设置：

```javascript
LinkExchange.mount('#badges', {
  source: 'https://cdn.example.com/badges.json',
  telemetry: {
    enabled: true,
    onEvent: function(event) {
      if (event.type === 'config_fetch_failed') {
        console.error('配置加载失败:', event.error)
      }
    }
  },
  fallback: {
    snapshot: { /* 备用配置 */ }
  }
})
```

## 下一步

- [核心 API](/api/core)
- [React 组件 API](/api/react)
- [类型定义](/api/types)
