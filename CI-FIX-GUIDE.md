# 🔧 GitHub Actions CI 修复指南

## 问题描述

GitHub Actions CI 报告两个问题：

1. ❌ **缺少 `pnpm-lock.yaml` 文件**
   ```
   Dependencies lock file is not found
   Supported file patterns: pnpm-lock.yaml
   ```

2. ⚠️ **Node.js 20 即将被弃用**
   ```
   Node.js 20 actions are deprecated
   ```

## ✅ 已修复的问题

### 1. 更新了 CI workflow

- ✅ 将 Node.js 版本从 `20` 更新到 `22`
- ✅ 将 pnpm 版本从 `8` 更新到 `9`
- ✅ 移除了 `--frozen-lockfile` 参数

**修改的文件：**
- `.github/workflows/ci.yml`
- `.github/workflows/config-lint.yml`

---

## 🚀 需要你执行的操作

### 步骤 1: 生成 pnpm-lock.yaml

**方式一：双击运行脚本（推荐）**
```
双击: generate-lock.bat
```

**方式二：手动执行命令**
```powershell
cd H:\Web\LinkExchangeBadges
pnpm install
```

### 步骤 2: 提交到 GitHub

```powershell
git add pnpm-lock.yaml
git add .github/workflows/ci.yml
git add .github/workflows/config-lint.yml

git commit -m "fix: update CI workflow and add pnpm-lock.yaml"

git push
```

---

## 📋 完整操作清单

- [x] ✅ 更新 `.github/workflows/ci.yml` (Node.js 22, pnpm 9)
- [x] ✅ 更新 `.github/workflows/config-lint.yml` (Node.js 22)
- [x] ✅ 创建 `generate-lock.bat` 脚本
- [ ] ⏳ 运行 `pnpm install` 生成 lock 文件
- [ ] ⏳ 提交更改到 GitHub

---

## 🎯 执行后的效果

提交后，GitHub Actions CI 将：
1. ✅ 使用 Node.js 22 运行
2. ✅ 找到 `pnpm-lock.yaml` 文件
3. ✅ 成功安装依赖
4. ✅ 运行类型检查、Lint、构建、测试

---

## 📊 CI 流程预览

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions CI 工作流程                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Checkout 代码                                           │
│         ↓                                                   │
│  2. Setup pnpm (v9)                                        │
│         ↓                                                   │
│  3. Setup Node.js (v22)                                    │
│         ↓                                                   │
│  4. Install dependencies (读取 pnpm-lock.yaml)             │
│         ↓                                                   │
│  5. Type check (pnpm -r exec tsc --noEmit)                │
│         ↓                                                   │
│  6. Lint (pnpm -r run lint)                               │
│         ↓                                                   │
│  7. Build (pnpm -r run build)                             │
│         ↓                                                   │
│  8. Test (pnpm -r run test)                               │
│         ↓                                                   │
│  9. Upload build artifacts                                 │
│         ↓                                                   │
│  ✅ 成功!                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 验证 CI 状态

提交后，在 GitHub 上查看 CI 状态：

1. 打开仓库页面
2. 点击 **Actions** 标签
3. 查看最新的 workflow run
4. 确认所有步骤都是 ✅ 绿色

---

## 🐛 故障排查

### 问题：lock 文件生成失败

**解决方案：**
```powershell
# 清理缓存重试
pnpm store prune
pnpm install
```

### 问题：CI 仍然报错

**检查：**
1. 确认 `pnpm-lock.yaml` 已提交
2. 确认 workflow 文件已更新
3. 查看 GitHub Actions 日志获取详细错误

---

## 📝 相关文件

- `.github/workflows/ci.yml` - 主 CI workflow
- `.github/workflows/config-lint.yml` - 配置验证 workflow
- `pnpm-workspace.yaml` - pnpm workspace 配置
- `generate-lock.bat` - Lock 文件生成脚本

---

准备好后，执行以下命令开始修复：

```powershell
# 1. 生成 lock 文件
.\generate-lock.bat

# 2. 提交更改
git add .
git commit -m "fix: update CI workflow and add pnpm-lock.yaml"
git push
```

然后到 GitHub 查看 Actions 运行结果！ 🚀
