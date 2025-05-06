/**
 * 目录UI渲染模块
 */

import {
  addClass,
  removeClass,
} from '../utils/dom'

// UI元素缓存
const tocList: HTMLElement | null = null
let activeTocItem: HTMLElement | null = null

/**
 * 获取标题下方的部分内容作为预览
 * @param headingElement 标题元素
 * @returns 预览文本
 */
export function getPreviewContent(headingElement: HTMLElement): string {
  // 默认预览长度
  const maxLength = 100
  let previewText = ``

  try {
    // 获取标题后面的元素
    let nextElement = headingElement.nextElementSibling

    // 尝试获取文本内容
    while (nextElement && previewText.length < maxLength) {
      // 跳过其他标题元素
      if (nextElement.tagName.match(/^H[1-6]$/)) {
        break
      }

      // 获取文本内容
      const text = nextElement.textContent || ``
      previewText += `${text} `

      // 移动到下一个元素
      nextElement = nextElement.nextElementSibling
    }

    // 截断到最大长度并添加省略号
    if (previewText.length > maxLength) {
      previewText = `${previewText.substring(0, maxLength)}...`
    }

    return previewText.trim() || `无预览内容`
  }
  catch (error) {
    console.error(`获取预览内容失败:`, error)
    return `无法加载预览`
  }
}

/**
 * 更新阅读进度条
 * @param percentage 百分比值 (0-100)
 */
export function updateProgressBar(percentage: number): void {
  const targets = document.getElementsByTagName(`wechat-toc`)
  const progressBar = targets[0]?.shadowRoot?.querySelector(`.wechat-toc-progress-bar`) as HTMLElement
  if (!progressBar)
    return

  // 确保百分比在有效范围内
  const validPercentage = Math.max(0, Math.min(100, percentage))
  progressBar.style.height = `${validPercentage}%`
}

/**
 * 高亮当前项
 * @param element 要高亮的元素
 */
export function highlightTocItem(element: HTMLElement): void {
  // 移除之前的高亮
  if (activeTocItem) {
    removeClass(activeTocItem, `wechat-toc-active`)
  }

  // 添加高亮到当前项
  addClass(element, `wechat-toc-active`)
  activeTocItem = element

  // 确保当前项在视图中
  ensureVisible(element)
}

/**
 * 通过ID高亮目录项
 * @param id 要高亮的项的ID
 */
export function highlightTocItemById(id: string): void {
  const targets = document.getElementsByTagName(`wechat-toc`)
  const tocList = targets[0]?.shadowRoot?.querySelector(`.wechat-toc-list`)
  if (!tocList)
    return

  const element = tocList.querySelector(`[data-id="${id}"]`)
  if (element && element instanceof HTMLElement) {
    highlightTocItem(element)
  }
}

/**
 * 确保元素在目录的可视范围内
 * @param element 目标元素
 */
function ensureVisible(element: HTMLElement): void {
  if (!tocList)
    return

  const elementRect = element.getBoundingClientRect()
  const containerRect = tocList.getBoundingClientRect()

  if (elementRect.bottom > containerRect.bottom) {
    // 元素在容器下方不可见
    tocList.scrollTop += elementRect.bottom - containerRect.bottom
  }
  else if (elementRect.top < containerRect.top) {
    // 元素在容器上方不可见
    tocList.scrollTop -= containerRect.top - elementRect.top
  }
}
