import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/LinkExchangeBadges/',
  srcDir: 'docs',
  ignoreDeadLinks: true,

  title: 'Link Exchange Badges',
  description: '跨栈徽章展示 SDK 文档',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: 'API 参考', link: '/api/core' },
      { text: '示例', link: '/examples/html' },
      { text: '高级', link: '/advanced/telemetry' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '配置', link: '/guide/configuration' },
            { text: '徽章规则', link: '/guide/badge-rules' },
            { text: '缓存策略', link: '/guide/caching' },
          ]
        },
        {
          text: '集成指南',
          items: [
            { text: 'HTML 集成', link: '/guide/html-integration' },
            { text: 'React 集成', link: '/guide/react-integration' },
            { text: 'Next.js 集成', link: '/guide/nextjs-integration' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '核心 API', link: '/api/core' },
            { text: 'React 组件', link: '/api/react' },
            { text: 'CDN 脚本', link: '/api/script' },
            { text: '类型定义', link: '/api/types' },
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: 'HTML 示例', link: '/examples/html' },
            { text: 'React 示例', link: '/examples/react' },
            { text: 'Next.js 示例', link: '/examples/nextjs' },
          ]
        }
      ],
      '/advanced/': [
        {
          text: '高级主题',
          items: [
            { text: '遥测与分析', link: '/advanced/telemetry' },
            { text: '安全性', link: '/advanced/security' },
            { text: '故障排查', link: '/advanced/troubleshooting' },
            { text: '最佳实践', link: '/advanced/best-practices' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/link-exchange-badges' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 Link Exchange Badges'
    },

    editLink: {
      pattern: 'https://github.com/yourusername/link-exchange-badges/edit/main/docs-site/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
