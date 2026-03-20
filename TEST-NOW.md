# 🎨 立即开始可视化测试

## 最简单的测试方式

### 📌 步骤 1: 双击启动脚本

找到并双击文件：
```
H:\Web\LinkExchangeBadges\examples\start-local-test.bat
```

### 📌 步骤 2: 选择测试项目

启动后会显示菜单：
```
┌────────────────────────────────────────────────────────────┐
│  选择要启动的示例:                                           │
│                                                            │
│  [1] React Vite 示例 (http://localhost:5173)               │
│  [2] Next.js 示例 (http://localhost:3000)                   │
│  [3] 打开 HTML 示例 (浏览器)                               │
│  [4] 仅启动测试服务器                                      │
│  [0] 退出                                                 │
└────────────────────────────────────────────────────────────┘
```

推荐选择 **[1] React Vite** 或 **[3] HTML**（最简单）

---

## 🎯 一分钟快速测试（HTML）

### Windows 双击运行

1. **启动测试服务器**
   ```
   双击: H:\Web\LinkExchangeBadges\examples\start-local-test.bat
   选择: [4] 仅启动测试服务器
   ```

2. **打开 HTML 文件**
   ```
   双击: H:\Web\LinkExchangeBadges\examples\html\index.html
   ```

3. **查看效果**
   - 浏览器显示 4 个徽章
   - 按 F12 打开控制台查看事件

---

## 📊 预期效果

### 页面显示

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Link Exchange SDK - HTML Example                          │
│                                                              │
│   This page demonstrates...                                 │
│                                                              │
│                                                              │
│   ┌────────────────────────────────────────────────────────┐ │
│   │  [GitHub Repo] [NPM Package] [TypeScript] [MIT]       │ │
│   └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 控制台输出（F12）

```
🚀 Link Exchange SDK 已加载
配置源: http://localhost:8080/test-badges.json
💡 提示: 请确保本地测试服务器正在运行

[LinkExchange Telemetry] sdk_init {type: "sdk_init", ...}
[LinkExchange Telemetry] config_fetch_start {type: "config_fetch_start", ...}
[LinkExchange Telemetry] config_fetch_success {type: "config_fetch_success", ...}
[LinkExchange Telemetry] render_success {type: "render_success", count: 4}
```

---

## 🧪 交互测试

### 测试 1: 点击徽章
- 点击任意徽章
- 控制台显示: `badge_click` 事件

### 测试 2: 刷新缓存
- 5秒内刷新页面 → 显示 `cache_hit`
- 等待5秒后刷新 → 显示 `cache_miss`

### 测试 3: 悬停效果
- 鼠标悬停在徽章上
- 查看链接地址（右下角）

---

## 🎨 徽章列表

| ID | 名称 | 链接 |
|----|------|------|
| github | GitHub Repo | github.com |
| npm | NPM Package | npmjs.com |
| typescript | TypeScript | typescriptlang.org |
| license | MIT License | opensource.org |

---

## ⚡ 快捷命令

如果批处理脚本无法运行，使用命令行：

```powershell
# 终端 1: 启动测试服务器
cd H:\Web\LinkExchangeBadges
node examples/server.mjs

# 终端 2: 启动 React 示例
cd H:\Web\LinkExchangeBadges\examples\react-vite
pnpm install
pnpm dev
```

然后访问: http://localhost:5173

---

## 🐛 问题排查

### 问题: 徽章不显示

**解决方案:**
```powershell
# 确保测试服务器正在运行
node examples/server.mjs
```

### 问题: 控制台报错 404

**解决方案:**
- 确保访问 `http://localhost:8080/test-badges.json` 能看到 JSON 数据

### 问题: Script 包未构建

**解决方案:**
```powershell
cd H:\Web\LinkExchangeBadges
pnpm build
```

---

## ✅ 测试检查清单

测试完成后确认：

- [ ] 页面显示了 4 个徽章
- [ ] 控制台显示了完整的事件流
- [ ] 点击徽章触发 `badge_click` 事件
- [ ] 刷新页面显示缓存事件
- [ ] 徽章可以正常跳转

---

准备好了吗？开始测试吧！ 🚀

**最快的开始方式:**
```
双击运行: examples\start-local-test.bat
选择: [1] React Vite
```
