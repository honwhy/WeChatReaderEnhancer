import type { Settings } from '../types'
import { ofetch } from 'ofetch'

const template = `
请用中文撰写一篇100字以内的文章摘要，需包含核心观点、主要论据和结论。要求语言精炼、逻辑清晰，重点突出文章的核心价值与创新点，确保信息完整且无遗漏。

优化说明：

结构化要求：明确要求包含核心观点/论据/结论三要素
质量标准：增加"逻辑清晰""重点突出"等质量维度
价值导向：强调"核心价值与创新点"的提炼
完整性要求：补充"确保信息完整"的约束条件
专业表达：使用"撰写"替代"总结"提升专业感

文章标题：%title%
文章内容：
%content%
`

export async function chat(body: { content: string, title: string }) {
  const settings = await storage.getItem<Settings>(`sync:settings`)
  if (!settings || !settings.endpoint || !settings.apiKey || !settings.modelName) {
    console.error(`请先设置模型API地址、密钥和名称`)
    return {
      choices: [
        {
          message: {
            content: ``,
          },
        },
      ],
    }
  }
  const propmt = template.replace(`%title%`, body.title).replace(`%content%`, body.content)
  // bailian
  // https://dashscope.aliyuncs.com/compatible-mode/
  // `qwen-plus`
  const response = await ofetch(`${settings.endpoint}/chat/completions`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: {
      model: settings.modelName,
      store: true,
      messages: [{ role: `user`, content: propmt }],
    },
  })
  console.log(`chatgpt返回`, response)
  return response
}
