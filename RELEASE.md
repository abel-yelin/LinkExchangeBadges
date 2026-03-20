# 发布检查清单

## 📦 准备阶段

### 代码准备
- [ ] 所有包的版本号已更新（使用 `pnpm version` 或手动更新）
- [ ] `pnpm build` 构建成功
- [ ] `pnpm test` 所有测试通过
- [ ] `pnpm typecheck` 类型检查通过
- [ ] `pnpm lint` 代码检查通过
- [ ] CHANGELOG.md 更新了版本变更内容

### 文档准备
- [ ] README.md 包含清晰的安装和使用说明
- [ ] API 文档完整（所有公开 API 都有注释）
- [ ] 示例代码可以正常运行
- [ ] 有在线演示（GitHub Pages 或 Vercel）

---

## 🚀 发布阶段

### npm 发布
```bash
# 1. 登录 npm（首次发布需要）
npm login
# 输入用户名、密码、邮箱

# 2. 发布到 npm
pnpm build
pnpm publish -r

# 3. 验证发布
# 访问 https://www.npmjs.com/package/@link-exchange/core
# 访问 https://www.npmjs.com/package/@link-exchange/react
# 访问 https://www.npmjs.com/package/@link-exchange/script
```

### GitHub 发布
- [ ] 创建 Git Tag：`git tag v0.1.0`
- [ ] 推送 Tag：`git push origin v0.1.0`
- [ ] 在 GitHub 创建 Release（从 Tag 创建）
- [ ] Release Notes 中包含主要功能、升级指南、已知问题

### 文档部署
- [ ] 文档站点构建成功：`cd docs-site && pnpm run docs:build`
- [ ] GitHub Pages 配置正确（Settings → Pages）
- [ ] 部署成功，文档可访问

---

## 📢 推广阶段

### 社区发布

#### 1. Product Hunt 发布
- [ ] 准备 Product Hunt 页面
  - 高质量的封面图
  - 清晰的产品描述（一句话）
  - 详细的介绍文案
  - 产品演示视频/GIF
- [ ] 选择发布时间（美国时间周二到周四，早上 6-8 点最佳）
- [ ] 准备第一波评论和点赞
- [ ] 发布当天及时回复评论

#### 2. Hacker News Show HN
- [ ] 准备 Show HN 帖子
  - 标题：`Show HN: I built Link Exchange Badges SDK`
  - 内容：项目介绍、解决的问题、使用示例
- [ ] 选择发布时间（工作日早上）
- [ ] 准备回答技术问题

#### 3. Reddit 发布
- [ ] r/javascript：发布教程和介绍
- [ ] r/react：发布 React 集成教程
- [ ] r/webdev：发布使用场景介绍
- [ ] 遵守各版块规则，不重复发帖

#### 4. Dev.to / Medium 文章
- [ ] 写一篇详细的使用教程
- [ ] 写一篇"为什么要造这个轮子"的技术文章
- [ ] 包含代码示例和截图

#### 5. 中文社区
- [ ] 掘金：发布中文教程
- [ ] 知乎：回答"如何管理网站 Footer 徽章"相关问题
- [ ] V2EX：发布项目介绍
- [ ] 阮一峰老师的科技爱好者周刊周刊投稿（tech.kenengba.com）

### 社交媒体

#### Twitter/X
- [ ] 发布项目介绍推文
- [ ] 发布使用教程系列推文
- [ ] 分享有趣的用户案例
- [ ] 回相关话题讨论（#react #webdev #typescript）

#### LinkedIn
- [ ] 发布专业项目介绍
- [ ] 分享技术挑战和解决方案
- [ ] 在相关技术群组分享

### 其他推广

#### 开源平台
- [ ] 提交到 [ Awesome JavaScript ](https://github.com/sorrycc/awesome-javascript)
- [ ] 提交到 [ Awesome React ](https://github.com/enaqx/awesome-react)
- [ ] 提交到 [ npm trends ](https://npmtrends.com/) 对比分析

#### 技术博客
- [ ] 写一篇 "如何管理远程配置驱动的 UI 组件"
- [ ] 分享 SDK 设计思路和架构
- [ ] 发布到个人博客和公司博客

---

## 📊 发布后跟踪

### 监控指标
- [ ] npm 下载量（https://npm-stat.com/）
- [ ] GitHub Stars/Forks 数量
- [ ] 文档站点访问量
- [ ] Issue 和 PR 数量
- [ ] 社区反馈收集

### 持续改进
- [ ] 定期回复 Issue
- [ ] 合并社区 PR
- [ ] 根据反馈规划新功能
- [ ] 定期发布新版本

---

## 🎯 第一周发布计划

### Day 1：发布日
- 发布到 npm
- 创建 GitHub Release
- 部署文档站点
- Product Hunt 发布
- Twitter/X 公告

### Day 2-3：跟进
- 回答 Product Hunt 评论
- Hacker News Show HN
- Reddit 发布
- Dev.to 文章

### Day 4-7：扩展
- 中文社区发布
- LinkedIn 分享
- 收集用户反馈
- 规划下一个版本

---

## 📝 模板：Product Hunt 发布文案

**标题：** Link Exchange Badges - 远程配置驱动的网站徽章管理 SDK

**一句话描述：**
在 Footer 展示合作伙伴徽章（Product Hunt、媒体报道等），配置远程驱动，更新无需重新部署。

**详细介绍：**
```
如果你运营着一个 SaaS 产品或开源项目，你一定经历过这样的烦恼：

❌ 每次添加新的合作伙伴徽章都要重新部署网站
❌ 不同环境（开发/测试/生产）的徽章配置难以管理
❌ 多语言网站需要根据地区展示不同徽章

Link Exchange Badges SDK 解决了这些问题：

✅ 远程 JSON 配置驱动：更新配置即可，无需重新部署
✅ 多环境支持：development / staging / production
✅ 按规则过滤：站点、环境、语言、分组
✅ 安全可靠：域名白名单、HTTPS 校验、配置验证
✅ 开箱即用：React / Next.js / Vanilla JS / HTML

谁在用：
- SaaS 产品官网（展示 Product Hunt、媒体报道、安全认证）
- 电商平台（展示支付方式、物流合作）
- 开源项目（展示赞助商、社区支持）

安装使用：
npm install @link-exchange/react

完全开源，MIT 协议。欢迎试用和反馈！
```

---

## 📝 模板：Hacker News Show HN 帖子

**标题：** Show HN: Link Exchange Badges SDK - 远程配置驱动的网站徽章管理

**正文：**
```
Hi HN，

我做了一个 Link Exchange Badges SDK，解决的是网站 Footer 区域展示合作伙伴徽章（如 Product Hunt、媒体报道、赞助商等）的常见问题。

主要痛点：
1. 每次添加新徽章都要重新部署
2. 多环境配置管理麻烦
3. 多语言网站需要根据地区展示不同徽章

解决方案：
- 远程 JSON 配置驱动，更新配置即可，无需重新部署
- 支持 React / Next.js / Vanilla JS
- 支持按站点、环境、语言、分组过滤徽章
- 内置安全白名单和配置验证
- 智能缓存和降级策略

开源地址：https://github.com/yourusername/link-exchange-badges
文档：https://yourusername.github.io/link-exchange-badges/
npm：https://www.npmjs.com/package/@link-exchange/core

欢迎试用和反馈！
```

---

## 📝 模板：掘金/知乎中文介绍

**标题：** 开源了一个远程配置驱动的网站徽章管理 SDK

**正文：**
```
如果你运营着一个产品官网，Footer 区域通常会展示：

- Product Hunt #1 Product of the Day
- "Featured on TechCrunch"
- 安全认证（SOC2、ISO27001）
- 赞助商 logo
- 支付方式

每次添加新的徽章，你都要：
1. 找到产品代码
2. 修改 Footer 组件
3. 重新构建
4. 部署上线
5. 等待 CDN 生效

费时费力，还容易出错。

我做了一个 SDK，把徽章配置抽出来放到远程 JSON：

```json
{
  "badges": [
    {
      "id": "producthunt",
      "name": "Product Hunt #1",
      "enabled": true,
      "imageUrl": "...",
      "linkUrl": "..."
    }
  ]
}
```

前端只要：

```tsx
<LinkExchange
  source="https://cdn.example.com/badges.json"
  siteId="my-site"
  environment="production"
/>
```

添加新徽章？修改 JSON 配置就好了，不需要重新部署。

GitHub: https://github.com/yourusername/link-exchange-badges
文档: https://yourusername.github.io/link-exchange-badges/

欢迎试用！
```

---

祝你发布顺利！🎉
