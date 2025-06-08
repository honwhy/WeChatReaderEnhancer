import type { Settings } from '../types'
import { omit } from 'lodash-es'
import { onMounted, onUnmounted, ref } from 'vue'

export const defaultSettings: Settings = {
  tocWidth: 280, // 目录宽度
  minLevel: 1, // 识别的最小标题级别
  maxLevel: 6, // 识别的最大标题级别
  tocPosition: `left`, // 目录位置
  useSerifFont: `0`, // 是否使用衬线字体
  justifyText: `0`, // 是否使用对齐文本
  isEnabled: true,
  serviceType: ``,
  endpoint: ``,
  apiKey: ``,
  modelName: ``,
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
    settings.value = { ...settings.value, ...omit(defaultSettings, `serviceType`, `endpoint`, `apiKey`, `modelName`) }
    storage.setItem(`sync:settings`, defaultSettings)
  }
  onMounted(async () => {
    console.log(`useSettings mounted`)
    const item = await storage.getItem<Settings>(`sync:settings`)
    // console.log(`useSettings getItem`, item)
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
