<script setup lang="tsx">
import type { ChatCompletionResponse, Settings, TocItem } from '../types'
import { injectScript } from '#imports'
import { marked } from 'marked'
import QRCode from 'qrcode'
import readingTime from 'reading-time/lib/reading-time'
import { onMounted, onUnmounted, type PropType, ref, toRaw } from 'vue'
import { useSettings } from '../composable/config'
import { useScanImages } from '../composable/scan'
import { MessageType } from '../types'
import { addClass, createElement, findHeadings, removeClass, scrollToElement, toggleClass } from '../utils/dom'
import { getReadingPosition, saveArticleContent } from '../utils/storage'
import { transformHtml2Markdown } from '../utils/turndown'
import Footer from './Footer.vue'
import { destroyImageViewer, initImageViewer } from './imageViewer'
import { destroyLinkifier, initLinkifier } from './linkifier'
import { destroyScrollObserver, initScrollObserver } from './observer'
import { buildTocTree, findArticleContainer, getArticleTitle, toggleItemExpansion } from './toc'
import {
  getPreviewContent,
  highlightTocItem,
} from './ui'

const { settings } = useSettings(handleSettingsChange)

const articleTitle = ref(``)
const itemList = ref<TocItem[]>([])

// function addVerticalText() {
//   // 添加收起状态下的竖向文字
//   const verticalText = createElement(
//     `div`,
//     {
//       class: `wechat-toc-vertical-text`,
//       title: `展开目录`,
//     },
//     `文章目录`,
//   )

//   // 为竖向文字添加点击事件，点击时展开目录
//   verticalText.addEventListener(`click`, () => {
//     expandTocPanel()
//   })

//   // 添加到页面
//   document.body.appendChild(verticalText)
// }

function buildToc() {
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
}
function handleSeriFont() {
  if (settings.value.useSerifFont === `1`) {
    if (!document.body.classList?.contains(`wre-serif-fonts`)) {
      addClass(document.body, `wre-serif-fonts`)
    }
  }
  else {
    removeClass(document.body, `wre-serif-fonts`)
  }
}
function handleJustifyText() {
  if (settings.value.justifyText === `1`) {
    if (!document.body.classList?.contains(`text-justify`)) {
      addClass(document.body, `text-justify`)
    }
  }
  else {
    removeClass(document.body, `text-justify`)
  }
}
function getArticleContent() {
  const original = document.querySelector(`#js_content`)
  if (original) {
    const clone = original.cloneNode(true) as HTMLElement // 深拷贝
    const toRemove = clone.querySelector(`.wechat-toc-summary-container`)
    if (toRemove) {
      toRemove.remove()
    }
    return clone.textContent || ``
  }
  return ``
}
function addAIDectectButton() {
  const container = document.querySelector(`#activity-name`)
  if (container) {
    const span = document.createElement(`span`)
    span.className = `wechat-toc-ai-detect-button`
    span.textContent = `去AI检测`
    container.appendChild(span)
    span.addEventListener(`click`, async () => {
      // 将文章以纯文本的方式写入到 storage 中
      const filteredText = getArticleContent()
      if (filteredText) {
        saveArticleContent(filteredText || ``)
        browser.runtime.sendMessage({
          type: MessageType.OPEN_AI_DETECT,
        }).then(() => {
          console.log(`AI检测按钮点击，已发送消息`)
        }).catch((error) => {
          console.error(`AI检测按钮点击失败:`, error)
        })
      }
    })
  }
}
async function addUpToTopButton() {
  await injectScript(`/up-to-top.js`, {
    keepInDom: true,
  })
}
useScanImages()
/**
 * 初始化插件
 */
async function init() {
  try {
    console.log(`公众号阅读增强插件启动中...`)

    buildToc()

    // 恢复面板状态（展开/折叠）
    restorePanelState()

    // 初始化滚动监听
    initScrollObserver(toRaw(itemList.value))

    // http/https 文本转超链接
    initLinkifier()
    await injectScript(`/wechat-linkifier-injected.js`, {
      keepInDom: true,
    })

    // 是否使用衬线字体
    handleSeriFont()
    // 是否使用文本对齐
    handleJustifyText()
    // 去AI 检测
    addAIDectectButton()
    // 返回顶部
    addUpToTopButton()
    console.log(`公众号阅读增强插件初始化完成`)
  }
  catch (error) {
    console.error(`公众号阅读增强插件初始化失败:`, error)
  }
}
/**
 * 更新操作
 */
async function update() {
  try {
    console.log(`公众号阅读增强插件更新中...`)
    buildToc()
    destroyScrollObserver()
    removeQrCode()
    // 初始化滚动监听
    initScrollObserver(toRaw(itemList.value))
    createQrCode()
    handleSeriFont()
    handleJustifyText()
  }
  catch (error) {
    console.error(`公众号阅读增强插件更新失败:`, error)
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
  destroyLinkifier()
}
function handleSettingsChange(settings: Settings) {
  if (!settings.isEnabled) {
    cleanup()
  }
  else {
    update()
  }
}
function createQrCode() {
  // 添加二维码悬浮框
  const qrCodeContainer = createElement(`div`, {
    class: `wechat-toc-qrcode-container${settings.value.tocPosition === `right` ? ` is-right` : ``}`,
    title: `扫描二维码在手机上阅读`,
  })
  const targets = document.getElementsByTagName(`wechat-toc`)
  const body = targets[0]!.shadowRoot
  body!.appendChild(qrCodeContainer)

  // 生成二维码
  const qrCodeCanvas = createElement(`canvas`)
  qrCodeContainer.appendChild(qrCodeCanvas)
  QRCode.toCanvas(qrCodeCanvas, window.location.href, { width: 150 }, (error: any) => {
    if (error)
      console.error(`二维码生成失败:`, error)
  })
}
// remove qrcode
function removeQrCode() {
  const targets = document.getElementsByTagName(`wechat-toc`)
  const body = targets[0]!.shadowRoot
  const qrCodeContainer = body!.querySelector(`.wechat-toc-qrcode-container`)
  if (qrCodeContainer) {
    qrCodeContainer.remove()
  }
}
// ai summary
async function createSummary() {
  // find js content
  const jsContent = document.querySelector(`#js_content`)
  if (!jsContent) {
    console.warn(`未找到 js_content`)
    return
  }
  const articleData = await transformHtml2Markdown(document.body.outerHTML)
  console.log(`articleData`, articleData)
  if (articleData.success) {
    const { title, content } = articleData.data!
    browser.runtime.sendMessage({
      type: MessageType.GET_SUMMARY,
      data: {
        title,
        content,
      },
    }).then(async (resp: ChatCompletionResponse) => {
      const content = resp.choices[0].message.content
      if (content) {
        console.log(`AI摘要:`, resp)
        const summaryContainer = createElement(`blockquote`, {
          class: `wechat-toc-summary-container`,
          title: `AI摘要`,
        })
        console.log(`articleData content`, content)
        const html = await marked(content)
        summaryContainer.innerHTML = html
        jsContent.prepend(summaryContainer)
      }
    })
  }
}
async function addReadingTime() {
  const metaContent = document.querySelector(`#meta_content`)
  if (!metaContent) {
    console.warn(`未找到 meta_content`)
    return
  }
  const { minutes } = readingTime(getArticleContent())
  const readingTimeContainer = createElement(`span`, {
    class: `rich_media_meta rich_media_meta_text wechat-toc-reading-time`,
    title: `预计阅读时间`,
  })
  readingTimeContainer.textContent = `(阅读大约需 ${Number.parseInt(minutes)} 分钟)`
  metaContent.append(readingTimeContainer)
}
onMounted(async () => {
  await init()
  // 获取上次阅读位置并滚动到对应位置
  const lastPosition = await getReadingPosition(window.location.href)
  if (lastPosition?.position) {
    window.scrollTo({ top: lastPosition.position, behavior: `smooth` })
  }
  // 初始化图片查看器
  initImageViewer()
  createQrCode()
  createSummary()
  addReadingTime()
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
      toggleClass(toggleIconRef.value!, `expanded`, props.item.isExpanded)
      toggleClass(toggleIconRef.value!, `collapsed`, !props.item.isExpanded)
      // 找到子目录列表
      const childList = itemRef.value!.querySelector(`ul`)
      if (childList) {
        toggleClass(childList, `wechat-toc-hidden`, !props.item.isExpanded)
      }
    }
    function onItemClick(e: { preventDefault: () => void }) {
      e.preventDefault()
      scrollToElement(props.item.element, 60)
      highlightTocItem(itemRef.value!)
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
          <a href={`#${props.item.id}`} class="wechat-toc-link" onClick={(e: any) => onItemClick(e)}>
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
  <div
    id="wechat-toc-container" ref="tocContainerRef" class="wechat-toc-container"
    :class="{ 'is-right': settings.tocPosition === 'right' }"
    :style="{ width: `${settings.tocWidth}px` }"
  >
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
