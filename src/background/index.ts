/**
 * 公众号阅读增强插件 - 背景脚本
 * 处理扩展生命周期和全局状态
 */

import type { Requests } from '../types'
import { defaultSettings } from '../composable/config'
import { MessageType } from '../types'
import { chat } from './agent'
import { openAiDetectPage } from './ai-detect'

export default defineBackground(() => {
  console.log(`公众号阅读增强插件背景服务工作进程已启动`, { id: browser.runtime.id })
  // 监听扩展安装
  browser.runtime.onInstalled.addListener(
    (details) => {
      if (details.reason === `install`) {
        // 存储默认设置
        storage.setItem(`sync:settings`, defaultSettings).then(() => {
          console.log(`默认设置已初始化`)
        })
        // 打开欢迎页面
        // browser.tabs.create({ url: 'welcome.html' });
      }
    },
  )
  browser.runtime.onMessage.addListener((message: Requests, sender) => {
    console.log(`收到消息`, { message, sender })
    if (message.type === MessageType.GET_SUMMARY) {
      return chat(message.data)
    }
    if (message.type === MessageType.OPEN_AI_DETECT) {
      return openAiDetectPage()
    }
    console.warn(`未知消息类型`, message.type)
    return true
  })
})
