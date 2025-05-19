import { createApp } from 'vue'
import App from './App.vue'
/**
 * 公众号阅读增强插件 - 内容脚本入口
 */
import '../styles/toc.css'
import '../styles/imageViewer.css'

export default defineContentScript({
  matches: [`https://mp.weixin.qq.com/s*`],

  cssInjectionMode: `ui`,

  async main(ctx) {
    // 2. Inject CSS styles
    const hostCssUrl = browser.runtime.getURL(`/injected.css`) // 确保路径正确

    const hostLink = document.createElement(`link`)
    hostLink.rel = `stylesheet`
    hostLink.href = hostCssUrl
    document.head.appendChild(hostLink)

    console.log(`宿主 CSS 已注入`) // 调试信息
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: `wechat-toc`,
      position: `inline`,
      anchor: `body`,
      onMount: (container) => {
        // Define how your UI will be mounted inside the container
        const app = createApp(App)
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount()
      },
    })

    // 4. Mount the UI
    ui.mount()
  },
})
