<script setup lang="tsx">
import type { PropType } from 'vue'
import type { Settings, TocItem } from '../types'
import { onMounted, onUnmounted, ref, toRaw } from 'vue'
import { useSettings } from '../composable/config'
import { addClass, createElement, findHeadings, removeClass, scrollToElement, toggleClass } from '../utils/dom'
import Footer from './Footer.vue'
import { destroyImageViewer, initImageViewer } from './imageViewer'
import { destroyScrollObserver, initScrollObserver } from './observer'
import { buildTocTree, findArticleContainer, getArticleTitle, toggleItemExpansion } from './toc'
import {
  getPreviewContent,
  highlightTocItem,
} from './ui'

const { settings } = useSettings(handleSettingsChange)

const articleTitle = ref(``)
const itemList = ref<TocItem[]>([])

function addVerticalText() {
  // 添加收起状态下的竖向文字
  const verticalText = createElement(
    `div`,
    {
      class: `wechat-toc-vertical-text`,
      title: `展开目录`,
    },
    `文章目录`,
  )

  // 为竖向文字添加点击事件，点击时展开目录
  verticalText.addEventListener(`click`, () => {
    expandTocPanel()
  })

  // 添加到页面
  document.body.appendChild(verticalText)
}
/**
 * 初始化插件
 */
async function init() {
  try {
    console.log(`公众号阅读增强插件启动中...`)

    // 如果插件被禁用，直接返回
    if (!settings.value.isEnabled) {
      console.log(`公众号阅读增强插件已禁用`)
      return
    }

    // 查找文章容器
    const articleContainer = findArticleContainer()
    if (!articleContainer) {
      console.warn(`未找到文章容器`)
      return
    }

    // 识别文章中的标题
    const headingElements = findHeadings(
      articleContainer,
      settings.value.minLevel,
      settings.value.maxLevel,
    )

    if (headingElements.length === 0) {
      console.warn(`未找到标题元素`)
      return
    }

    // 构建目录树
    itemList.value = buildTocTree(headingElements)
    if (itemList.value.length === 0) {
      console.warn(`生成目录树失败`)
      return
    }
    console.log(`生成目录树成功`, itemList.value)
    // 获取文章标题
    articleTitle.value = getArticleTitle()

    // 恢复面板状态（展开/折叠）
    restorePanelState()

    // 初始化滚动监听
    initScrollObserver(toRaw(itemList.value))

    addVerticalText()
    console.log(`公众号阅读增强插件初始化完成`)
  }
  catch (error) {
    console.error(`公众号阅读增强插件初始化失败:`, error)
  }
}
const tocContainerRef = ref<HTMLElement | null>(null)
async function cleanup() {
  if (tocContainerRef.value) {
    tocContainerRef.value.style.display = `none`
  }
  itemList.value = []
  articleTitle.value = ``
  destroyImageViewer()
  destroyScrollObserver()
}
function handleSettingsChange(settings: Settings) {
  if (!settings.isEnabled) {
    cleanup()
  }
  else {
    init()
  }
}

onMounted(async () => {
  await init()
  // 初始化图片查看器
  initImageViewer()
})
onUnmounted(() => {
  cleanup()
})

function expandTocPanel() {
  if (!tocContainerRef.value)
    return
  removeClass(tocContainerRef.value, `wechat-toc-minimized`)
  storage.setItem(`local:wechat-toc-minimized`, false)
}
function minimizeTocPanel() {
  if (!tocContainerRef.value)
    return
  addClass(tocContainerRef.value, `wechat-toc-minimized`)
  storage.setItem(`local:wechat-toc-minimized`, true)
}
function toggleTocPanel() {
  if (tocContainerRef.value?.classList?.contains(`wechat-toc-minimized`)) {
    expandTocPanel()
  }
  else {
    minimizeTocPanel()
  }
}
async function restorePanelState() {
  const isMinimized = await storage.getItem(`local:wechat-toc-minimized`)
  if (isMinimized) {
    minimizeTocPanel()
  }
  else {
    expandTocPanel()
  }
}
// 内部组件
const TocItemList = defineComponent({
  name: `TocItemList`,
  props: {
    items: {
      type: Array as PropType<TocItem[]>,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    return () => {
      if (!props.items || props.items.length === 0) {
        return null
      }
      const className = `wechat-toc-list-level-${props.level}`
      return (
        <ul class={className}>
          {
            props.items.map(item => (
              <TocItemItem item={item} key={item.id} />
            ))
          }
        </ul>
      )
    }
  },
})
const TocItemItem = defineComponent({
  name: `TocItemItem`,
  props: {
    item: {
      type: Object as PropType<TocItem>,
      required: true,
    },
  },
  setup(props) {
    const itemRef = ref<HTMLElement | null>(null)
    const toggleIconRef = ref<HTMLElement | null>(null)
    function onToggleIconClick() {
      // 切换子项的展开状态
      toggleItemExpansion(props.item)
      toggleClass(toggleIconRef.value, `expanded`, props.item.isExpanded)
      toggleClass(toggleIconRef.value, `collapsed`, !props.item.isExpanded)
      // 找到子目录列表
      const childList = itemRef.value.querySelector(`ul`)
      if (childList) {
        toggleClass(childList, `wechat-toc-hidden`, !props.item.isExpanded)
      }
    }
    function onItemClick(e) {
      e.preventDefault()
      scrollToElement(props.item.element, 60)
      highlightTocItem(itemRef.value)
    }
    return () => {
      const className = `wechat-toc-item wechat-toc-level-${props.item.level}`
      const toggleIconClassName = `wechat-toc-toggle ${props.item.isExpanded ? `expanded` : `collapsed`}`
      // 获取预览内容（从标题下方提取一部分文本）
      const previewText = getPreviewContent(props.item.element)
      return (
        <li ref={itemRef} class={className} data-id={props.item.id}>
          {
            props.item.children && props.item.children.length > 0
              ? (
                  <span ref={toggleIconRef} class={toggleIconClassName} onClick={() => onToggleIconClick()}>
                    {props.item.isExpanded ? `▼` : `▶`}
                  </span>
                )
              : null
          }
          <a href={`#${props.item.id}`} class="wechat-toc-link" onClick={e => onItemClick(e)}>
            {props.item.text}
          </a>
          <div class="wechat-toc-preview">{previewText}</div>
          {
            props.item.children && props.item.children.length > 0
              ? (
                  <div class="wechat-toc-children">
                    <TocItemList items={props.item.children} level={props.item.level + 1} />
                  </div>
                )
              : null
          }
        </li>
      )
    }
  },
})
</script>

<template>
  <div id="wechat-toc-container" ref="tocContainerRef" class="wechat-toc-container" :style="{ width: `${settings.tocWidth}px` }">
    <!-- 阅读进度指示器 -->
    <div class="wechat-toc-progress-bar" />
    <!-- 标题栏 -->
    <div class="wechat-toc-header" @dblclick="toggleTocPanel">
      <h2 class="wechat-toc-title">
        {{ articleTitle }}
      </h2>
      <button class="wechat-toc-button wechat-toc-minimize" title="最小化" @click="minimizeTocPanel">
        ×
      </button>
    </div>
    <div class="wechat-toc-list">
      <TocItemList :items="itemList" />
    </div>
    <Footer />
    <button class="wechat-toc-button wechat-toc-expand" title="展开目录" @click="expandTocPanel">
      ≡
    </button>
  </div>
</template>
