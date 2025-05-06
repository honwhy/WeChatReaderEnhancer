import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: [`@wxt-dev/module-vue`],
  manifest: ({ mode }) => ({
    name: `公众号阅读增强器`,
    icons: {
      128: mode === `development` ? `/icon/icon256-gray.png` : `/icon/icon128.png`,
    },
    permissions: [`storage`],
    web_accessible_resources: [
      {
        resources: [`*.png`, `*.svg`],
        matches: [`<all_urls>`],
      },
    ],
  }),
  // @ts-expect-error cannot find Vite PluginOption export
  vite: () => ({
    plugins: [
      vueJsx(),
    ],
  }),
})
