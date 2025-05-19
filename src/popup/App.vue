<script setup lang="ts">
import type { Settings } from '../types'
import { computed, ref, watch } from 'vue'
import { defaultSettings, useSettings } from '../composable/config'
import { serviceOptions } from '../utils/models'

function handleSettingsChange(newSettings: Settings) {
  // Handle settings change
  console.log(`Settings changed:`, newSettings)
}
const { settings, updateSettings, resetSettings } = useSettings(handleSettingsChange)
const tocWidth = ref(settings.value.tocWidth)
watch(
  () => settings.value.tocWidth,
  (newValue) => {
    tocWidth.value = newValue
  },
  { immediate: true },
)
const min = 200
const max = 400

function handleRangeInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  console.log(`handleRangeInput 输入`, value)
  if (!value && value !== `0`) {
    tocWidth.value = defaultSettings.tocWidth
  }
  else {
    const data = Number.parseInt(value, 10)
    if (data > max) {
      tocWidth.value = max
    }
    else if (data < min) {
      tocWidth.value = min
    }
    else {
      tocWidth.value = data
    }
  }
  settings.value.tocWidth = tocWidth.value
  updateSettings(settings.value)
}

const rangeProgressStyle = computed(() => {
  let data = tocWidth.value
  if (data > max) {
    data = max
  }
  else if (data < min) {
    data = min
  }
  const percentage = ((data - min) / (max - min)) * 100
  return {
    width: `${percentage}% !important`,
  }
})
function handleDrapInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  console.log(`拖动输入`, value)
  tocWidth.value = Number.parseInt(value, 10)
  settings.value.tocWidth = tocWidth.value
  updateSettings(settings.value)
}
function onReset() {
  resetSettings()
  tocWidth.value = settings.value.tocWidth
  showMessage(`已恢复默认宽度`)
}
/** 当前服务信息 */
const currentService = computed(
  () => serviceOptions.find(s => s.value === settings.value.serviceType) || serviceOptions[0],
)
function handleModelSettingsChange() {
  if (settings.value.serviceType && settings.value.apiKey && settings.value.modelName) {
    settings.value.apiKey = settings.value.apiKey.trim()
    settings.value.endpoint = currentService.value.endpoint
    updateSettings(settings.value)
    showMessage(`模型设置已保存`)
  }
}
// 显示消息
function showMessage(message: string, isError: boolean = false) {
  // 创建消息元素
  const messageElement = document.createElement(`div`)
  messageElement.textContent = message
  messageElement.style.position = `fixed`
  messageElement.style.bottom = `16px`
  messageElement.style.left = `50%`
  messageElement.style.transform = `translateX(-50%)`
  messageElement.style.padding = `8px 16px`
  messageElement.style.borderRadius = `4px`
  messageElement.style.backgroundColor = isError ? `#f44336` : `#01CC7A`
  messageElement.style.color = `white`
  messageElement.style.zIndex = `1000`
  messageElement.style.transition = `opacity 0.3s`

  // 添加到页面
  document.body.appendChild(messageElement)

  // 2秒后移除
  setTimeout(() => {
    messageElement.style.opacity = `0`
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement)
      }
    }, 300)
  }, 2000)
}
</script>

<template>
  <div class="card">
    <div class="card-title">
      <span class="icon">
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </span>
      目录导航设置
    </div>
    <div class="card-subtitle">
      调整目录宽度，优化导航体验
    </div>

    <label for="tocWidth">目录宽度</label>
    <div class="flex-between">
      <input
        id="tocWidth"
        v-model="tocWidth"
        type="number"
        min="200"
        max="400"
        aria-label="目录宽度数值"
        title="目录宽度数值"
        @blur="handleRangeInput"
      >
      <span>px</span>
    </div>
    <div class="range-wrapper">
      <div class="range-track" />
      <div :style="rangeProgressStyle" class="range-progress" />
      <input
        id="tocWidthRange"
        v-model="tocWidth"
        type="range"
        min="200"
        max="400"
        step="10"
        title="拖动调整目录宽度"
        aria-label="拖动调整目录宽度"
        @input="handleDrapInput"
      >
    </div>
    <!-- 目录位置 -->
    <label>目录位置</label>
    <div class="flex-between">
      <div style="display: flex; gap: 10px; align-items: center;">
        <label>
          <input
            v-model="settings.tocPosition"
            type="radio"
            value="left"
            aria-label="左侧"
            title="左侧"
            name="tocPosition"
            @change="updateSettings(settings)"
          >
          左侧
        </label>
        <label>
          <input
            v-model="settings.tocPosition"
            type="radio"
            value="right"
            aria-label="右侧"
            title="右侧"
            name="tocPosition"
            @change="updateSettings(settings)"
          >
          右侧
        </label>
      </div>
    </div>

    <!-- 使用衬线字体 -->
    <label>使用衬线字体</label>
    <div class="flex-between">
      <div style="display: flex; gap: 10px; align-items: center;">
        <label>
          <input
            v-model="settings.useSerifFont"
            type="radio"
            value="1"
            aria-label="是"
            title="是"
            name="useSerifFont"
            @change="updateSettings(settings)"
          >
          是
        </label>
        <label>
          <input
            v-model="settings.useSerifFont"
            type="radio"
            value="0"
            aria-label="否"
            title="否"
            name="useSerifFont"
            @change="updateSettings(settings)"
          >
          否
        </label>
      </div>
    </div>
    <!-- 文本左右对齐 -->
    <label>文本左右对齐</label>
    <div class="flex-between">
      <div style="display: flex; gap: 10px; align-items: center;">
        <label>
          <input
            v-model="settings.justifyText"
            type="radio"
            value="1"
            aria-label="是"
            title="是"
            name="justifyText"
            @change="updateSettings(settings)"
          >
          是
        </label>
        <label>
          <input
            v-model="settings.justifyText"
            type="radio"
            value="0"
            aria-label="否"
            title="否"
            name="justifyText"
            @change="updateSettings(settings)"
          >
          否
        </label>
      </div>
    </div>
    <div class="buttons">
      <button id="resetButton" class="secondary" @click="onReset">
        恢复默认
      </button>
    </div>
  </div>
  <!-- ai model -->
  <div class="card">
    <div class="card-title">
      <span class="icon">
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </span>
      AI 模型设置
    </div>
    <div class="card-subtitle">
      使用 AI 助手帮助您更好地理解文章内容
    </div>
    <label>服务类型</label>
    <div class="flex">
      <select
        v-model="settings.serviceType"
        style="width: 100%;"
        aria-label="服务类型"
        @change="handleModelSettingsChange"
      >
        <option v-for="(option, index) in serviceOptions" :key="index" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <label>API Key</label>
    <div class="flex">
      <input
        v-model="settings.apiKey"
        style="width: 100%;"
        type="password"
        aria-label="API Key"
        placeholder="sk-..."
        @blur="handleModelSettingsChange"
      >
    </div>
    <label>模型名词</label>
    <div class="flex">
      <select
        v-model="settings.modelName"
        style="width: 100%;"
        aria-label="模型名词"
        @change="handleModelSettingsChange"
      >
        <option v-for="(option, index) in currentService.models" :key="index" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
  <div class="card">
    <div class="card-title">
      <span class="icon">
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
          />
        </svg>
      </span>
      功能介绍
    </div>

    <ul class="feature-list">
      <li class="feature-item">
        <div class="feature-icon">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </div>
        <div class="feature-text">
          <div class="feature-title">
            智能目录导航
          </div>
          <div class="feature-desc">
            自动提取文章标题，快速定位和跳转，提升长文阅读效率
          </div>
        </div>
      </li>
      <li class="feature-item">
        <div class="feature-icon">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
        </div>
        <div class="feature-text">
          <div class="feature-title">
            图片查看增强
          </div>
          <div class="feature-desc">
            优化图片浏览体验，支持缩放查看，让阅读更流畅
          </div>
        </div>
      </li>
      <li class="feature-item">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot-icon h-5 w-5"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
        </div>
        <div class="feature-text">
          <div class="feature-title">
            AI 智能总结
          </div>
          <div class="feature-desc">
            自动生成文章摘要，快速获取关键信息，节省阅读时间
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- New Friendly Links Card -->
  <div class="card">
    <div class="card-title">
      <span class="icon">
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6l3 3v2h-1V9h-3V6H5v12h11v-5h1zM8 6h1v1H8V6zm2 0h1v1h-1V6zm2 0h1v1h-1V6zm2 0h1v1h-1V6zM8 9h1v1H8V9zm2 9h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 0h1v1H8v-1zm2-3h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 0h1v1H8v-1zm7-9h-3l-3-3H8v1h2l3 3h3v1zm-4 6h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-4 0h1v1h-1v-1z"
          />
        </svg>
      </span>
      ✨ 友情链接
    </div>
    <ul class="friend-links-list">
      <li class="friend-link-item">
        <a
          href="https://liuguangka.com/zh"
          target="_blank"
          rel="noopener noreferrer"
          title="流光卡片 - 体验最佳的文字卡片工具"
        >
          <!-- You might need a local icon or keep it simple -->
          <!-- <img src="path/to/liuguangka-icon.png" alt="流光卡片 icon" class="link-icon"> -->
          <svg class="svg-icon link-icon" viewBox="0 0 24 24">
            <path
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            />
          </svg>
          <!-- Generic link icon -->
          流光卡片 - 文字卡片制作工具
        </a>
      </li>
      <li class="friend-link-item">
        <a
          href="https://honwhy.wang"
          target="_blank"
          rel="noopener noreferrer"
          title="作者的个人网站 - Honwhy"
        >
          <!-- You might need a local icon or keep it simple -->
          <!-- <img src="path/to/liuguangka-icon.png" alt="流光卡片 icon" class="link-icon"> -->
          <svg class="svg-icon link-icon" viewBox="0 0 24 24">
            <path
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            />
          </svg>
          <!-- Generic link icon -->
          作者的个人网站 - Honwhy
        </a>
      </li>
    </ul>
  </div>
</template>
