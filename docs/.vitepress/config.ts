import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "公众号阅读增强器",
  description: "让微信公众号阅读体验更舒适",
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
    ],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'VitePress' }],
    [
      'meta',
      {
        property: 'og:image',
        content: '/og.png'
      }
    ],
    ['meta', { property: 'og:url', content: 'https://wxreader.honwhy.wang/' }],
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.usefathom.com/script.js',
    //     'data-site': 'AZBRSFGG',
    //     'data-spa': 'auto',
    //     defer: ''
    //   }
    // ]
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en',
      title: "Wechat Reader Enhancer",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Features', link: '/en/features' },
          { text: 'Configuration', link: '/en/configure' },
          { text: 'Privacy Policy', link: '/en/privacy' },
        ],
        sidebar: [
          {
            text: 'Features',
            items: [
              { text: 'Product Functions', link: '/en/product-requirements' },
              { text: 'Feature Highlights', link: '/en/features' },
              { text: 'FAQ', link: '/en/faq' }
            ]
          }
        ],
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '功能介绍', link: '/features' },
      { text: '插件配置', link: '/configure' },
      { text: '隐私协议', link: '/privacy' },
    ],

    sidebar: [
      {
        text: '功能介绍',
        items: [
          { text: '产品功能', link: '/product-requirements' },
          { text: '功能特性', link: '/features' },
          { text: '常见问题', link: '/faq' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/honwhy/WeChatReaderEnhancer' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present honwhy.wang'
    }
  }
})
