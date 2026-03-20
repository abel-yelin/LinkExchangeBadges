# 🎨 可视化测试指南

本指南将帮助你快速在浏览器中查看 Link Exchange SDK 的运行效果。

## 📋 测试前准备

### 检查环境

确保已安装：
- Node.js 18+
- pnpm 8+

```powershell
node --version
pnpm --version
```

## 🚀 测试方案

### 方案一：HTML 示例（最简单，推荐）

#### 步骤 1: 启动本地测试服务器

打开 **PowerShell 窗口 1**，执行：

```powershell
cd H:\Web\LinkExchangeBadges

# 启动配置服务器
node examples/server.mjs
```

你会看到：
```
🚀 本地测试服务器已启动!
📍 地址: http://localhost:8080
```

#### 步骤 2: 在浏览器中打开 HTML 示例

打开新的浏览器标签页，访问：

```
file:///H:/Web/LinkExchangeBadges/examples/html/index.html
```

或者双击文件：
```
H:\Web\LinkExchangeBadges\examples\html\index.html
```

#### 步骤 3: 查看效果

你应该看到：
- 页面显示 "Link Exchange SDK - HTML Example"
- Footer 区域显示 4 个徽章：
  - GitHub Repo
  - NPM Package
  - TypeScript
  - MIT License

#### 步骤 4: 查看控制台

按 `F12` 打开浏览器开发者工具，查看控制台输出：

```
🚀 Link Exchange SDK 已加载
配置源: http://localhost:8080/test-badges.json
[LinkExchange Telemetry] sdk_init {type: 'sdk_init', ...}
[LinkExchange Telemetry] config_fetch_success ...
[LinkExchange Telemetry] render_success ...
```

---

### 方案二：React Vite 示例

#### 步骤 1: 启动本地测试服务器

打开 **PowerShell 窗口 1**：

```powershell
cd H:\Web\LinkExchangeBadges
node examples/server.mjs
```

保持此窗口运行。

#### 步骤 2: 启动 React Vite 开发服务器

打开 **PowerShell 窗口 2**：

```powershell
cd H:\Web\LinkExchangeBadges\examples\react-vite
pnpm install
pnpm dev
```

#### 步骤 3: 访问应用

浏览器会自动打开 `http://localhost:5173`，或手动访问。

#### 步骤 4: 查看效果

- 主页面显示基础徽章配置
- 滚动到底部查看 Footer 完整配置
- 控制台查看埋点事件

---

### 方案三：Next.js 示例

#### 步骤 1: 启动本地测试服务器

打开 **PowerShell 窗口 1**：

```powershell
cd H:\Web\LinkExchangeBadges
node examples/server.mjs
```

#### 步骤 2: 配置环境变量

打开 **PowerShell 窗口 2**：

```powershell
cd H:\Web\LinkExchangeBadges\examples\nextjs
copy .env.local.example .env.local
notepad .env.local
```

编辑 `.env.local`：
```env
NEXT_PUBLIC_BADGES_SOURCE=http://localhost:8080/test-badges.json
```

#### 步骤 3: 启动 Next.js

```powershell
pnpm install
pnpm dev
```

#### 步骤 4: 访问应用

访问 `http://localhost:3000`

---

## 🧪 交互测试

### 测试点 1: 徽章点击

1. 点击任意徽章
2. 控制台应显示：`[LinkExchange Telemetry] badge_click`

### 测试点 2: 缓存功能

1. 刷新页面
2. 控制台应显示：`cache_hit`（5秒内刷新）
3. 等待5秒后刷新，显示：`cache_miss`

### 测试点 3: 安全过滤

修改 `test-badges.json`，添加一个恶意链接：
```json
{
  "id": "malicious",
  "linkUrl": "javascript:alert(1)"
}
```
- 应该被过滤，不显示

### 测试点 4: 分组过滤

在代码中设置 `group: 'community'`
- 只显示 GitHub 和 NPM 徽章

---

## 📊 预期效果

### 页面显示

```
┌─────────────────────────────────────────┐
│  Link Exchange SDK - HTML Example      │
│                                         │
│  This page demonstrates...             │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  [GitHub] [NPM] [TypeScript] [MIT] │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 控制台输出

```
🚀 Link Exchange SDK 已加载
配置源: http://localhost:8080/test-badges.json
💡 提示: 请确保本地测试服务器正在运行
[LinkExchange Telemetry] sdk_init {type: "sdk_init", source: "...", siteId: "html-example"}
[LinkExchange Telemetry] config_fetch_start {type: "config_fetch_start", source: "..."}
[LinkExchange Telemetry] config_fetch_success {type: "config_fetch_success", source: "...", configVersion: "1"}
[LinkExchange Telemetry] render_success {type: "render_success", count: 4}
```

---

## 🐛 故障排查

### 问题: 徽章不显示

**可能原因：**
1. 本地测试服务器未启动
2. Script 包未构建

**解决方案：**
```powershell
# 确保先构建
cd H:\Web\LinkExchangeBadges
pnpm build

# 启动测试服务器
node examples/server.mjs
```

### 问题: CORS 错误

**解决方案：**
确保测试服务器正在运行，它已配置 CORS 头。

### 问题: 控制台报错 404

**检查：**
1. 测试服务器是否在 `http://localhost:8080` 运行
2. URL 是否正确

---

## 🎯 测试清单

完成以下测试项：

- [ ] HTML 示例显示徽章
- [ ] React Vite 示例显示徽章
- [ ] Next.js 示例显示徽章
- [ ] 点击徽章触发埋点
- [ ] 缓存功能正常工作
- [ ] 控制台显示完整事件流
- [ ] 安全过滤正常工作

---

## 📝 测试模板

记录你的测试结果：

| 测试项 | 状态 | 备注 |
|--------|------|------|
| HTML 示例 | ⬜ 通过 / ❌ 失败 | |
| React 示例 | ⬜ 通过 / ❌ 失败 | |
| Next.js 示例 | ⬜ 通过 / ❌ 失败 | |
| 点击埋点 | ⬜ 通过 / ❌ 失败 | |
| 缓存功能 | ⬜ 通过 / ❌ 失败 | |
| 安全过滤 | ⬜ 通过 / ❌ 失败 | |

---

准备好后，开始测试吧！🚀
