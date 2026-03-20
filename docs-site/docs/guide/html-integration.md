# HTML 集成指南

本指南详细介绍如何在纯 HTML 项目中集成 Link Exchange Badges SDK。

## 准备工作

### 1. 准备配置文件

创建 `badges.json` 文件：

```json
{
  "configVersion": "1",
  "schemaVersion": "1.0.0",
  "updatedAt": "2024-01-01T00:00:00Z",
  "badges": [
    {
      "id": "github",
      "name": "GitHub",
      "enabled": true,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/GitHub-100000?logo=github",
      "linkUrl": "https://github.com",
      "alt": "GitHub"
    }
  ]
}
```

### 2. 部署配置文件

将配置文件部署到 CDN 或静态服务器：

```
https://cdn.example.com/badges.json
```

### 3. 配置 CORS

确保服务器允许跨域请求：

```javascript
// Express.js 示例
app.get('/badges.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.json(config)
})
```

## 基础集成

### 方法 1：CDN 引入

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的网站</title>
  <script src="https://cdn.example.com/link-exchange.js"></script>
</head>
<body>
  <h1>欢迎</h1>
  <div id="badges"></div>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

### 方法 2：本地文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的网站</title>
  <script src="./lib/link-exchange.js"></script>
</head>
<body>
  <h1>欢迎</h1>
  <div id="badges"></div>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

## 高级配置

### 完整配置示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的网站</title>
  <script src="https://cdn.example.com/link-exchange.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .badges-section {
      margin: 30px 0;
    }
    .badges-container {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>我的网站</h1>
      <p>使用 Link Exchange Badges 展示合作伙伴</p>
    </header>

    <main>
      <section class="badges-section">
        <h2>合作伙伴</h2>
        <div id="partner-badges" class="badges-container"></div>
      </section>

      <section class="badges-section">
        <h2>技术栈</h2>
        <div id="tech-badges" class="badges-container"></div>
      </section>
    </main>

    <footer>
      <div id="footer-badges" class="badges-container"></div>
    </footer>
  </div>

  <script>
    // 配置
    const CONFIG = {
      source: 'https://cdn.example.com/badges.json',
      siteId: 'my-html-site',
      environment: 'production',
      locale: 'zh-CN',
      cache: {
        enabled: true,
        ttlMs: 30 * 60 * 1000
      },
      security: {
        allowedLinkDomains: ['github.com', 'npmjs.com'],
        allowedImageDomains: ['img.shields.io', 'github.com']
      },
      telemetry: {
        enabled: true,
        onEvent: function(event) {
          console.log('[Badge Event]', event.type, event)
        }
      }
    }

    // 挂载徽章
    LinkExchange.mount('#partner-badges', {
      ...CONFIG,
      group: 'partners'
    })

    LinkExchange.mount('#tech-badges', {
      ...CONFIG,
      group: 'technologies'
    })

    LinkExchange.mount('#footer-badges', {
      ...CONFIG,
      group: 'footer'
    })
  </script>
</body>
</html>
```

## 样式定制

### 自定义样式

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>自定义样式</title>
  <script src="https://cdn.example.com/link-exchange.js"></script>
  <style>
    .custom-badges {
      display: flex;
      gap: 20px;
      justify-content: center;
      padding: 20px 0;
    }

    .custom-badges a {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .custom-badges a:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .custom-badges img {
      height: 30px;
      width: auto;
    }
  </style>
</head>
<body>
  <div id="badges" class="custom-badges"></div>

  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json',
      className: 'custom-badges'
    })
  </script>
</body>
</html>
```

### 响应式设计

```html
<style>
  .badges-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px 0;
  }

  @media (max-width: 768px) {
    .badges-container {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
  }

  @media (max-width: 480px) {
    .badges-container {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }
</style>
```

## 交互功能

### 动态切换

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>动态切换</title>
  <script src="https://cdn.example.com/link-exchange.js"></script>
  <style>
    .tab-button {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      background: #e0e0e0;
      cursor: pointer;
      border-radius: 4px;
    }
    .tab-button.active {
      background: #667eea;
      color: white;
    }
    .badge-group {
      display: none;
    }
    .badge-group.active {
      display: block;
    }
  </style>
</head>
<body>
  <div>
    <button class="tab-button active" data-group="partners">合作伙伴</button>
    <button class="tab-button" data-group="technologies">技术栈</button>
  </div>

  <div id="partners" class="badge-group active"></div>
  <div id="technologies" class="badge-group"></div>

  <script>
    const tabs = document.querySelectorAll('.tab-button')
    const groups = document.querySelectorAll('.badge-group')

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const group = tab.dataset.group

        // 更新按钮状态
        tabs.forEach(t => t.classList.remove('active'))
        tab.classList.add('active')

        // 更新组显示
        groups.forEach(g => g.classList.remove('active'))
        document.getElementById(group).classList.add('active')
      })
    })

    // 初始加载第一组
    LinkExchange.mount('#partners', {
      source: 'https://cdn.example.com/badges.json',
      group: 'partners'
    })
  </script>
</body>
</html>
```

## 性能优化

### 延迟加载

```html
<script>
  // 等待页面加载完成
  window.addEventListener('load', () => {
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  })
</script>
```

### 交互观察器

```html
<script>
  // 当容器进入视口时才加载
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        LinkExchange.mount('#badges', {
          source: 'https://cdn.example.com/badges.json'
        })
        observer.unobserve(entry.target)
      }
    })
  })

  observer.observe(document.querySelector('#badges'))
</script>
```

### 预加载资源

```html
<head>
  <link rel="preconnect" href="https://cdn.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
  <link rel="preload" as="image" href="https://img.shields.io/badge/GitHub-100000?logo=github">
</head>
```

## 错误处理

### 基础错误处理

```html
<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json',
    fallback: {
      silent: false
    }
  }).catch(error => {
    console.error('徽章加载失败:', error)
    document.getElementById('badges').innerHTML =
      '<p>徽章暂时无法显示</p>'
  })
</script>
```

### 使用快照配置

```html
<script>
  const FALLBACK_CONFIG = {
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

  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json',
    fallback: {
      snapshot: FALLBACK_CONFIG
    }
  })
</script>
```

## 调试

### 启用详细日志

```html
<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json',
    telemetry: {
      enabled: true,
      onEvent: function(event) {
        console.log('[Badges]', event.type, event)

        // 高亮重要事件
        if (event.type.includes('success')) {
          console.log('%c✓ ' + event.type, 'color: green')
        } else if (event.type.includes('failed') || event.type.includes('error')) {
          console.error('%c✗ ' + event.type, 'color: red', event)
        }
      }
    }
  })
</script>
```

## 部署

### 1. 静态托管

将 HTML 文件部署到静态托管服务：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

### 2. 服务器

使用 Nginx 托管：

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/html;

  location /badges.json {
    add_header Access-Control-Allow-Origin *;
    add_header Cache-Control "public, max-age=300";
  }
}
```

### 3. CDN

使用 CDN 加速：

```
https://cdn.example.com/badges.json
https://cdn.example.com/link-exchange.js
```

## 最佳实践

### 1. 使用语义化 HTML

```html
<footer>
  <section>
    <h3>合作伙伴</h3>
    <div id="partner-badges"></div>
  </section>
</footer>
```

### 2. 添加加载状态

```html
<div id="badges">
  <div class="loading">加载中...</div>
</div>

<script>
  LinkExchange.mount('#badges', {
    source: 'https://cdn.example.com/badges.json',
    telemetry: {
      enabled: true,
      onEvent: (event) => {
        if (event.type === 'render_success') {
          document.querySelector('.loading')?.remove()
        }
      }
    }
  })
</script>
```

### 3. 优雅降级

```html
<noscript>
  <div id="badges">
    <a href="https://github.com">
      <img src="https://img.shields.io/badge/GitHub-100000?logo=github" alt="GitHub">
    </a>
  </div>
</noscript>
```

## 常见问题

### Q: SDK 未加载？

检查 script 标签路径是否正确。

### Q: 徽章不显示？

1. 检查配置 URL 是否可访问
2. 查看浏览器控制台错误
3. 验证容器元素是否存在

### Q: CORS 错误？

配置服务器 CORS 头：

```
Access-Control-Allow-Origin: *
```

## 下一步

- [React 集成](/guide/react-integration)
- [Next.js 集成](/guide/nextjs-integration)
- [示例](/examples/html)
