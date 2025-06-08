// https://matrix.tencent.com/ai-detect/
// 1. Import the style
import { createApp } from 'vue'
import App from './App.vue'

export default defineContentScript({
  matches: [`https://matrix.tencent.com/ai-detect/`],
  // 2. Set cssInjectionMode
  cssInjectionMode: `manual`,

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: `we-toc-ui`,
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
