# HTML 示例

本节展示如何在纯 HTML 项目中使用 Link Exchange Badges SDK。

## 基础示例

### 1. 创建 HTML 文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Exchange Badges 示例</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    footer {
      margin-top: 50px;
      padding: 30px 0;
      border-top: 1px solid #eee;
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
    <h1>我的网站</h1>
    <p>这是一个使用 Link Exchange Badges 的示例网站。</p>
  </div>

  <footer>
    <div class="container">
      <h3>合作伙伴</h3>
      <div id="partner-badges" class="badges-container"></div>
    </div>
  </footer>

  <!-- 引入 SDK -->
  <script src="https://cdn.example.com/link-exchange.js"></script>

  <!-- 初始化 SDK -->
  <script>
    LinkExchange.mount('#partner-badges', {
      source: 'https://cdn.example.com/badges.json',
      group: 'partners'
    })
  </script>
</body>
</html>
```

### 2. 创建配置文件

创建 `badges.json`：

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
      "group": "partners",
      "priority": 100,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/GitHub-100000?logo=github&logoColor=white",
      "linkUrl": "https://github.com",
      "alt": "GitHub",
      "target": "_blank",
      "rel": "noopener noreferrer"
    },
    {
      "id": "npm",
      "name": "npm",
      "enabled": true,
      "group": "partners",
      "priority": 90,
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white",
      "linkUrl": "https://www.npmjs.com",
      "alt": "npm",
      "target": "_blank",
      "rel": "noopener noreferrer"
    }
  ]
}
```

## 完整配置示例

### HTML 文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Exchange Badges 完整示例</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 0;
      text-align: center;
    }

    header h1 {
      margin: 0;
      font-size: 2.5em;
    }

    header p {
      margin-top: 10px;
      font-size: 1.2em;
      opacity: 0.9;
    }

    .section {
      margin: 40px 0;
      padding: 30px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .section h2 {
      margin-top: 0;
      color: #667eea;
    }

    footer {
      background: #f8f9fa;
      padding: 40px 0;
      margin-top: 60px;
      border-top: 1px solid #e9ecef;
    }

    .badges-container {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
    }

    .badge-item {
      display: inline-block;
      transition: transform 0.2s;
    }

    .badge-item:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Link Exchange Badges</h1>
      <p>在 HTML 中轻松展示合作伙伴徽章</p>
    </div>
  </header>

  <div class="container">
    <section class="section">
      <h2>关于本项目</h2>
      <p>
        这是一个演示如何在 HTML 项目中使用 Link Exchange Badges SDK 的完整示例。
        SDK 支持远程配置、规则过滤、缓存等功能。
      </p>
    </section>

    <section class="section">
      <h2>技术栈</h2>
      <div id="tech-badges" class="badges-container"></div>
    </section>

    <section class="section">
      <h2>认证与奖项</h2>
      <div id="cert-badges" class="badges-container"></div>
    </section>
  </div>

  <footer>
    <div class="container">
      <h3>合作伙伴</h3>
      <div id="partner-badges" class="badges-container"></div>
      <p style="margin-top: 20px; color: #6c757d; font-size: 0.9em;">
        © 2024 My Website. All rights reserved.
      </p>
    </div>
  </footer>

  <!-- 引入 SDK -->
  <script src="https://cdn.example.com/link-exchange.js"></script>

  <!-- 初始化 SDK -->
  <script>
    // 通用配置
    const BASE_CONFIG = {
      source: 'https://cdn.example.com/badges.json',
      cache: {
        enabled: true,
        ttlMs: 30 * 60 * 1000 // 30 分钟
      },
      telemetry: {
        enabled: true,
        onEvent: function(event) {
          console.log('[Badge Event]', event.type, event)

          // 发送到分析平台
          if (window.analytics) {
            analytics.track(event.type, event)
          }
        }
      }
    }

    // 技术栈徽章
    LinkExchange.mount('#tech-badges', {
      ...BASE_CONFIG,
      group: 'technologies',
      className: 'tech-badges'
    })

    // 认证徽章
    LinkExchange.mount('#cert-badges', {
      ...BASE_CONFIG,
      group: 'certifications',
      className: 'cert-badges'
    })

    // 合作伙伴徽章
    LinkExchange.mount('#partner-badges', {
      ...BASE_CONFIG,
      group: 'partners',
      className: 'partner-badges'
    })
  </script>
</body>
</html>
```

## 响应式设计示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>响应式徽章展示</title>
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
</head>
<body>
  <div id="badges" class="badges-container"></div>

  <script src="https://cdn.example.com/link-exchange.js"></script>
  <script>
    LinkExchange.mount('#badges', {
      source: 'https://cdn.example.com/badges.json'
    })
  </script>
</body>
</html>
```

## 交互示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>交互式徽章切换</title>
  <style>
    .tab-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .tab-button {
      padding: 10px 20px;
      border: none;
      background: #e0e0e0;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
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
  <div class="tab-buttons">
    <button class="tab-button active" data-group="partners">合作伙伴</button>
    <button class="tab-button" data-group="technologies">技术栈</button>
    <button class="tab-button" data-group="certifications">认证</button>
  </div>

  <div id="partners" class="badge-group active"></div>
  <div id="technologies" class="badge-group"></div>
  <div id="certifications" class="badge-group"></div>

  <script src="https://cdn.example.com/link-exchange.js"></script>
  <script>
    const tabs = document.querySelectorAll('.tab-button')
    const groups = document.querySelectorAll('.badge-group')

    // 初始化所有徽章组
    const mountResults = {}

    function mountGroup(groupId) {
      if (!mountResults[groupId]) {
        LinkExchange.mount(`#${groupId}`, {
          source: 'https://cdn.example.com/badges.json',
          group: groupId
        }).then(result => {
          mountResults[groupId] = result
        })
      }
    }

    // 初始加载第一组
    mountGroup('partners')

    // 标签切换
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const group = tab.dataset.group

        // 更新标签状态
        tabs.forEach(t => t.classList.remove('active'))
        tab.classList.add('active')

        // 更新组显示
        groups.forEach(g => g.classList.remove('active'))
        document.getElementById(group).classList.add('active')

        // 挂载对应的徽章组
        mountGroup(group)
      })
    })
  </script>
</body>
</html>
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
      onEvent: function(event) {
        if (event.type === 'render_success') {
          document.querySelector('.loading')?.remove()
        }
      }
    }
  })
</script>
```

### 3. 错误处理

```html
<div id="badges"></div>

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
    console.error('徽章加载失败:', error)
    document.getElementById('badges').innerHTML =
      '<p class="error">徽章加载失败，请稍后重试。</p>'
  })
</script>
```

### 4. 性能优化

```html
<head>
  <!-- 预连接到 CDN -->
  <link rel="preconnect" href="https://cdn.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">

  <!-- 预加载图片 -->
  <link rel="preload" as="image" href="https://img.shields.io/badge/GitHub-100000?logo=github">
</head>

<body>
  <div id="badges"></div>

  <!-- 延迟加载 SDK -->
  <script>
    window.addEventListener('load', function() {
      var script = document.createElement('script')
      script.src = 'https://cdn.example.com/link-exchange.js'
      script.async = true
      script.onload = function() {
        LinkExchange.mount('#badges', {
          source: 'https://cdn.example.com/badges.json',
          cache: {
            enabled: true,
            ttlMs: 60 * 60 * 1000 // 1 小时
          }
        })
      }
      document.head.appendChild(script)
    })
  </script>
</body>
```

## 下一步

- [React 示例](/examples/react)
- [Next.js 示例](/examples/nextjs)
- [配置选项](/guide/configuration)
