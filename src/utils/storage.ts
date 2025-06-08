import type { ReadingPosition } from '../types'

/**
 * 保存用户上次阅读位置
 * @param url 文章URL
 * @param position 滚动位置
 */
export function saveReadingPosition(url: string, position: number): void {
  const key = `reading_position_${hashString(url)}`
  const data = { url, position, timestamp: Date.now() }

  storage.setItem<ReadingPosition>(`sync:${key}`, data)
}

/**
 * 获取用户上次阅读位置
 * @param url 文章URL
 * @returns Promise，解析为上次阅读位置
 */
export async function getReadingPosition(url: string) {
  const key = `reading_position_${hashString(url)}`
  const data = await storage.getItem<ReadingPosition>(`sync:${key}`)
  return data
}
/**
 * 简单的字符串哈希函数
 * @param str 输入字符串
 * @returns 哈希值
 */
function hashString(str: string): string {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36)
}
const article_key = `local:we-toc-article-content`
export async function saveArticleContent(text: string) {
  storage.setItem<string>(article_key, text)
}
export async function getArticleContent() {
  return await storage.getItem<string>(article_key)
}
export function watchArticleContent(callback: (newValue: string | null, oldValue: string | null) => void) {
  return storage.watch<string>(article_key, (newValue, oldValue) => {
    callback(newValue, oldValue)
  })
}
