import { browser } from '#imports'

const targetUrl = `https://matrix.tencent.com/ai-detect/`

export async function openAiDetectPage() {
  try {
    const tabs = await browser.tabs.query({ url: targetUrl })
    if (tabs && tabs.length > 0) {
      const tab = tabs[0]
      await browser.tabs.update(tab.id!, { active: true })
      await browser.windows.update(tab.windowId, { focused: true })
    }
    else {
      await browser.tabs.create({ url: targetUrl })
    }
  }
  catch (error) {
    console.error(`Error querying tabs:`, error)
  }
}
