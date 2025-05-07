<script setup lang="ts">
import type { Settings } from '../types'
import { computed, watch } from 'vue'
import { defaultSettings, useSettings } from '../composable/config'

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

    <div class="buttons">
      <button id="resetButton" class="secondary" @click="onReset">
        恢复默认
      </button>
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
      <!-- Add more links here if needed -->
    </ul>
  </div>
</template>
