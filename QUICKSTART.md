# 快速启动指南

## 方式一：使用批处理脚本（Windows 推荐）

双击运行 `build-and-test.bat` 文件，或在命令行执行：

```cmd
.\build-and-test.bat
```

脚本将自动完成：
1. ✅ 检查 Node.js 和 pnpm 版本
2. ✅ 安装所有依赖
3. ✅ 类型检查
4. ✅ 构建所有包
5. ✅ 运行测试

## 方式二：手动执行命令

### 1. 打开终端（PowerShell 或 CMD）

### 2. 进入项目目录

```powershell
cd H:\Web\LinkExchangeBadges
```

### 3. 安装依赖

```powershell
pnpm install
```

### 4. 类型检查

```powershell
pnpm typecheck
```

### 5. 构建所有包

```powershell
pnpm build
```

### 6. 运行测试

```powershell
pnpm test
```

## 运行示例项目

### React Vite 示例

```powershell
cd examples\react-vite
pnpm install
pnpm dev
```

然后在浏览器打开 `http://localhost:5173`

### Next.js 示例

```powershell
cd examples\nextjs
copy .env.local.example .env.local
REM 编辑 .env.local 设置 NEXT_PUBLIC_BADGES_SOURCE
pnpm install
pnpm dev
```

然后在浏览器打开 `http://localhost:3000`

## 预期结果

### 构建产物

```
packages/
├── core/
│   └── dist/
│       ├── index.js       (ESM)
│       ├── index.cjs      (CJS)
│       └── index.d.ts     (类型声明)
├── react/
│   └── dist/
│       ├── index.js       (ESM)
│       ├── index.cjs      (CJS)
│       └── index.d.ts     (类型声明)
└── script/
    └── dist/
        ├── link-exchange.esm.js    (ESM)
        └── link-exchange.umd.cjs   (UMD)
```

### 测试结果

```
✓ resolveBadges tests (7 tests)
✓ cache tests (5 tests)
✓ validateConfig tests (4 tests)
```

## 故障排查

### 问题 1: pnpm 未找到

**解决方案：** 安装 pnpm

```powershell
npm install -g pnpm
```

### 问题 2: Node.js 版本过低

**解决方案：** 升级到 Node.js 18+

从 [nodejs.org](https://nodejs.org/) 下载 LTS 版本

### 问题 3: 依赖安装失败

**解决方案：** 清理缓存重试

```powershell
pnpm store prune
pnpm install
```

### 问题 4: 构建失败

**解决方案：** 检查 TypeScript 版本

```powershell
pnpm list typescript
```

确保 TypeScript 版本是 5.x

### 问题 5: 端口被占用

**解决方案：** 使用不同端口

```powershell
# Vite
pnpm dev --port 3001

# Next.js
pnpm dev --port 3001
```

## 验证安装

运行以下命令验证 SDK 是否正确构建：

```powershell
# 检查 core 包
dir packages\core\dist

# 检查 react 包
dir packages\react\dist

# 检查 script 包
dir packages\script\dist
```

应该能看到相应的 `.js`、`.cjs` 和 `.d.ts` 文件。

## 下一步

1. ✅ 查看示例代码学习用法
2. ✅ 阅读 `README.md` 了解完整 API
3. ✅ 修改配置文件测试不同场景
4. ✅ 集成到你的项目中

## 需要帮助？

- 查看 `README.md` 获取详细文档
- 查看 `ralph/progress.txt` 了解开发进度
- 检查 `examples/` 目录中的示例项目
