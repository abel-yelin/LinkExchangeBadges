# 🚀 最终修复方案

## 问题分析

CI 错误：`File not listed within the file list of project`

**根本原因：** TypeScript 的 `extends` 和 `composite` 模式在 CI 环境中产生了配置冲突。

---

## ✅ 解决方案

**完全移除继承和引用** - 让每个包的 tsconfig.json 完全独立

### 修改的文件：

1. **tsconfig.json (根)** → 简化为只有 `{"files": []}`
2. **packages/core/tsconfig.json** → 完整独立的配置
3. **packages/react/tsconfig.json** → 完整独立的配置
4. **packages/script/tsconfig.json** → 完整独立的配置
5. **.github/workflows/ci.yml** → 分别对每个包进行类型检查

---

## 📋 修改内容总结

### 每个 tsconfig.json 现在：
- ❌ 不使用 `extends`
- ❌ 不使用 `composite`
- ❌ 不使用 project references
- ✅ 完全独立的配置
- ✅ 明确的 `include: ["src"]`
- ✅ 所有必要的 compilerOptions

### CI 现在分别检查每个包：
```yaml
- name: Type check - Core
  run: cd packages/core && pnpm exec tsc --noEmit

- name: Type check - React
  run: cd packages/react && pnpm exec tsc --noEmit

- name: Type check - Script
  run: cd packages/script && pnpm exec tsc --noEmit
```

---

## 🚀 立即执行

```powershell
git add .
git commit -m "fix: simplify TypeScript configs and fix CI typecheck

- Remove extends and composite mode from all tsconfigs
- Make each package tsconfig fully independent
- Add explicit compilerOptions to each package
- Fix CI to typecheck packages individually
- Simplify root tsconfig to only {files: []}

This fixes the 'File not listed within file list' error in CI"

git push
```

---

## ✅ 预期 CI 结果

```
✅ Setup pnpm 9
✅ Setup Node.js 22
✅ Install dependencies
✅ Build core package
✅ Build remaining packages
✅ Type check - Core        ← 现在应该通过
✅ Type check - React      ← 现在应该通过
✅ Type check - Script     ← 现在应该通过
✅ Lint
✅ Test
```

---

## 📊 修改对比

### 之前 (有问题的配置):
```json
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true
  }
}
```

### 现在 (修复后的配置):
```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

**执行上面的 git 命令！这次应该能修复 CI 问题了。** 🚀
