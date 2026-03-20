# 安装

Link Exchange Badges 提供多种安装方式，根据你的项目选择合适的方案。

## 包说明

我们提供了三个 npm 包：

- **@link-exchange/core**：核心 SDK，提供所有底层 API
- **@link-exchange/react**：React 组件封装
- **@link-exchange/script**：CDN 脚本，用于 HTML 直接引入

## npm 安装

### React 用户

推荐使用 `@link-exchange/react`：

```bash
# npm
npm install @link-exchange/react

# pnpm
pnpm add @link-exchange/react

# yarn
yarn add @link-exchange/react
```

### 其他框架用户

如果需要更多控制，可以直接使用 `@link-exchange/core`：

```bash
npm install @link-exchange/core
```

### CDN 用户

不需要安装包，直接在 HTML 中引入：

```html
<script src="https://cdn.example.com/link-exchange.js"></script>
```

## 系统要求

### Node.js

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）

### 浏览器

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### React 版本

`@link-exchange/react` 需要：

- React >= 18.0.0

## 配置远程服务器

SDK 需要一个提供 JSON 配置的远程服务器。

### 1. 创建配置文件

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
      "renderType": "image",
      "imageUrl": "https://img.shields.io/badge/GitHub-100000?logo=github",
      "linkUrl": "https://github.com",
      "alt": "GitHub",
      "target": "_blank"
    }
  ]
}
```

### 2. 配置 CORS

确保服务器允许跨域请求：

```javascript
// Express.js 示例
app.get('/badges.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'public, max-age=300') // 5 分钟缓存
  res.json(badgesConfig)
})
```

### 3. 部署到 CDN

推荐使用 CDN 加速配置文件：

- AWS CloudFront
- Cloudflare
- Vercel
- Netlify

### 4. 版本管理

建议在 URL 中包含版本号：

```
https://cdn.example.com/badges.v1.json
```

这样可以实现：

- 无缝切换版本
- 多版本并存
- 快速回滚

## TypeScript 支持

所有包都包含内置的 TypeScript 类型定义：

```typescript
import type { BadgeConfig, MountOptions } from '@link-exchange/core'
import type { LinkExchangeProps } from '@link-exchange/react'
```

### 类型导入

推荐使用 `type` 关键字导入类型：

```typescript
import type { BadgeItem } from '@link-exchange/core'
```

这样可以避免编译后的代码包含未使用的导入。

## 开发环境设置

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/link-exchange-badges.git
cd link-exchange-badges
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建包

```bash
pnpm build
```

### 4. 运行示例

```bash
# HTML 示例
cd examples/html
# 需要先启动本地服务器
node ../../examples/server.mjs

# React 示例
cd examples/react-vite
pnpm install
pnpm dev

# Next.js 示例
cd examples/nextjs
pnpm install
pnpm dev
```

## 生产环境检查清单

部署前请检查：

- [ ] 远程配置已部署到 CDN
- [ ] CORS 已正确配置
- [ ] 缓存策略已设置
- [ ] 安全白名单已配置
- [ ] 遥测已集成监控平台
- [ ] 错误处理已测试
- [ ] 多浏览器兼容性已测试
- [ ] 移动端适配已测试

## 升级指南

### 从 v0.x 升级到 v1.0

查看 [迁移指南](https://github.com/yourusername/link-exchange-badges/blob/main/MIGRATION.md)。

### 查看当前版本

```bash
npm list @link-exchange/react
```

### 更新到最新版本

```bash
npm update @link-exchange/react
```

## 故障排查

### 安装失败

1. 清除缓存：`pnpm store prune`
2. 删除 node_modules：`rm -rf node_modules`
3. 重新安装：`pnpm install`

### 类型错误

1. 确保 TypeScript 版本 >= 5.0
2. 清除 TypeScript 缓存：`rm -rf node_modules/.cache`
3. 重启 TypeScript 服务器

### 运行时错误

1. 检查浏览器控制台
2. 验证配置 URL 可访问
3. 确认配置格式正确

## 下一步

- [快速开始](/guide/getting-started)
- [配置选项](/guide/configuration)
- [API 参考](/api/core)
