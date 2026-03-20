# 🔧 GitHub Actions CI 修复完整指南

## 问题诊断

GitHub Actions CI 报告以下错误：

```
❌ Cannot find module '@link-exchange/core' or its corresponding type declarations.
⚠️  Node.js 20 actions are deprecated
```

### 根本原因

1. **构建顺序问题** - React 包需要 Core 包的类型定义文件 (`.d.ts`) 才能进行类型检查
2. **workspace 依赖** - `workspace:*` 依赖需要先构建被依赖的包

---

## ✅ 已修复的文件

### 1. `.github/workflows/ci.yml`

**修改内容：**
- ✅ Node.js: `20` → `22`
- ✅ pnpm: `8` → `9`
- ✅ 添加 **先构建 Core 包** 的步骤
- ✅ 改用 `--filter` 确保正确构建顺序
- ✅ 添加 pnpm store 缓存
- ✅ 允许无 lockfile 安装 (`--frozen-lockfile=false`)

**新构建顺序：**
```
1. pnpm install
2. cd packages/core && pnpm build  ← 先构建 Core
3. pnpm -r --filter '@link-exchange/*' run build  ← 再构建其他包
4. pnpm -r exec tsc --noEmit  ← 类型检查
5. pnpm -r run lint
6. pnpm -r run test
```

### 2. `.github/workflows/config-lint.yml`

**修改内容：**
- ✅ Node.js: `20` → `22`

---

## 🚀 本地验证步骤

在推送到 GitHub 之前，请在本地验证构建：

### 方式一：使用验证脚本（推荐）

```powershell
# 双击运行
verify-build.bat
```

### 方式二：手动验证

```powershell
# 1. 进入项目目录
cd H:\Web\LinkExchangeBadges

# 2. 清理旧构建
Remove-Item -Recurse -Force packages\core\dist
Remove-Item -Recurse -Force packages\react\dist
Remove-Item -Recurse -Force packages\script\dist

# 3. 先构建 Core 包
cd packages\core
pnpm build
cd ..\..

# 4. 构建所有包
pnpm -r --filter "@link-exchange/*" run build

# 5. 类型检查
pnpm -r exec tsc --noEmit

# 6. 运行测试
pnpm -r run test
```

---

## 📝 提交到 GitHub

本地验证通过后，执行：

```powershell
# 1. 查看更改的文件
git status

# 2. 添加所有更改
git add .

# 3. 提交
git commit -m "fix: resolve CI build order and workspace dependencies

- Update Node.js from 20 to 22
- Update pnpm from 8 to 9
- Fix build order: build core package first
- Use --filter for workspace package builds
- Add pnpm store caching
- Allow install without lockfile

Fixes:
- Cannot find module '@link-exchange/core' error
- Workspace dependency resolution in CI"

# 4. 推送
git push
```

---

## 🎯 预期 CI 成功输出

```
✅ Setup pnpm
✅ Setup Node.js 22
✅ Setup pnpm cache
✅ Install dependencies
✅ Build core package (with type declarations)
   📦 packages/core/dist/index.js
   📦 packages/core/dist/index.cjs
   📦 packages/core/dist/index.d.ts
✅ Build all packages
✅ Type check
✅ Lint
✅ Test
✅ Upload build artifacts
```

---

## 🐛 故障排查

### 问题：CI 仍然报错 `Cannot find module '@link-exchange/core'`

**可能原因：**
1. Core 包构建失败
2. TypeScript 编译选项问题

**解决方案：**
```yaml
# 确保 Core 包构建步骤存在
- name: Build core package (with type declarations)
  run: |
    cd packages/core && pnpm build
    ls -la dist/
```

### 问题：TypeScript 报错

**检查 Core 包的 tsconfig.json：**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,  ← 确保生成 .d.ts
    "declarationMap": true
  }
}
```

### 问题：React 包构建失败

**检查是否先生成了 Core 的类型文件：**
```powershell
# 本地测试
ls packages/core/dist/index.d.ts

# 如果不存在，先构建 core
cd packages/core && pnpm build
```

---

## 📊 完整的工作流程

```
┌─────────────────────────────────────────────────────────────┐
│  本地开发流程                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 修改代码                                               │
│     ↓                                                      │
│  2. 运行 verify-build.bat 验证                            │
│     ↓                                                      │
│  3. 本地测试通过                                          │
│     ↓                                                      │
│  4. git commit & push                                     │
│     ↓                                                      │
│  5. GitHub Actions 自动运行 CI                             │
│     ↓                                                      │
│  6. ✅ CI 通过                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 检查清单

在推送代码前确认：

- [ ] ✅ 本地 `verify-build.bat` 验证通过
- [ ] ✅ Core 包生成了 `dist/index.d.ts`
- [ ] ✅ React 包构建成功
- [ ] ✅ Script 包构建成功
- [ ] ✅ 类型检查通过
- [ ] ✅ 测试通过
- [ ] ✅ CI workflow 文件已更新

---

## 🎯 下一步

1. **本地验证**
   ```powershell
   .\verify-build.bat
   ```

2. **查看构建产物**
   ```powershell
   dir packages\core\dist
   dir packages\react\dist
   dir packages\script\dist
   ```

3. **提交到 GitHub**
   ```powershell
   git add .
   git commit -m "fix: resolve CI build order"
   git push
   ```

4. **在 GitHub 查看 Actions**
   - 打开仓库 → Actions 标签
   - 查看最新的 workflow run
   - 确认所有步骤都是 ✅

---

准备好了吗？运行 `verify-build.bat` 开始本地验证！ 🚀
