/**
 * 公众号阅读增强插件 - 类型定义
 */

// 目录项数据结构
export interface TocItem {
  id: string // 标题元素的唯一ID
  level: number // 标题级别 (1-6)
  text: string // 标题文本内容
  element: HTMLElement // 原始DOM元素引用
  children: TocItem[] // 子标题项
  isExpanded: boolean // 是否展开子项
}

// 插件设置
export interface Settings {
  tocWidth: number // 目录宽度
  minLevel: number // 识别的最小标题级别
  maxLevel: number // 识别的最大标题级别
  tocPosition: string // 目录位置 (left/right)
  isEnabled: boolean // 插件是否启用
  serviceType: string // 模型服务类型
  endpoint: string // 模型API地址
  apiKey: string // 模型API密钥
  modelName: string // 模型名称
}

// 脚本泄露报告
export interface ScriptLeakReport {
  timestamp: number // 报告时间戳
  url: string // 发生泄露的页面URL
  details: any // 泄露详情
}

// 背景脚本消息类型
export type BackgroundMessage =
  | { type: `GET_SETTINGS` }
  | { type: `SAVE_SETTINGS`, settings: Settings }
  | { type: `REPORT_SCRIPT_LEAK`, details: any }
  | { type: `CLEAN_SCRIPT_LEAK` }

// 背景脚本响应类型
export type BackgroundResponse = { settings: Settings } | { success: boolean }

export interface ReadingPosition {
  url: string // 文章URL
  position: number // 滚动位置
  timestamp: number // 时间戳
}
export default {}

// 请求类型
export enum MessageType {
  GET_SUMMARY, // 获取摘要
}
export interface Requests {
  type: MessageType // 请求类型
  url: string // 请求的URL
  method: string // 请求方法
  data: any // 请求体
}

export interface Responses {
  code: number // 响应状态码
  data: any // 响应体
  message: string // 响应消息
}

export interface ChatCompletionResponse {
  choices: Choice[]
}

export interface Choice {
  message: Message
}

export interface Message {
  content: string
}
