import type { Settings } from '../types'
import { onMounted, onUnmounted, ref } from 'vue'

export const defaultSettings: Settings = {
  tocWidth: 280, // 目录宽度
  minLevel: 1, // 识别的最小标题级别
  maxLevel: 6, // 识别的最大标题级别
  isEnabled: true, // 插件是否启用
}
export function useSettings(handleSettingsChange: (settings: Settings) => void) {
  const settings = ref<Settings>({ ...defaultSettings })

  const unwatch = storage.watch<Settings>(`sync:settings`, (newSettings) => {
    settings.value = newSettings || { ...defaultSettings }
    handleSettingsChange(newSettings!)
  })

  function updateSettings(newSettings: Settings) {
    settings.value = newSettings
    storage.setItem(`sync:settings`, newSettings)
  }
  function resetSettings() {
    settings.value = { ...defaultSettings }
    storage.setItem(`sync:settings`, defaultSettings)
  }
  onMounted(async () => {
    console.log(`useSettings mounted`)
    const item = await storage.getItem<Settings>(`sync:settings`)
    console.log(`useSettings getItem`, item)
    if (item) {
      settings.value = item
    }
  })
  onUnmounted(() => {
    unwatch()
  })
  return {
    settings,
    updateSettings,
    resetSettings,
  }
}
