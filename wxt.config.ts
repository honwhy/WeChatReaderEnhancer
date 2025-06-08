import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  entrypointsDir: `src`,
  modules: [`@wxt-dev/module-vue`, `@wxt-dev/webextension-polyfill`],
  manifest: ({ mode }) => ({
    name: `公众号阅读增强器`,
    icons: {
      128: mode === `development` ? `/icon/icon96-gray.png` : `/icon/icon96.png`,
    },
    permissions: [`storage`, `tabs`],
    web_accessible_resources: [
      {
        resources: [`*.png`, `*.svg`, `*.css`, `*.js`, `wechat-linkifier-injected.js`, `up-to-top.js`],
        matches: [`<all_urls>`],
      },
    ],
  }),
  vite: () => ({
    plugins: [
      vueJsx(),
    ],
  }),
})
