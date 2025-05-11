import turndownPluginGfm from '@joplin/turndown-plugin-gfm'
import * as cheerio from 'cheerio'
import { ofetch } from 'ofetch'
import TurndownService from 'turndown'

const Status = {
  Fail: 400,
  Success: 200,
}
const errObj: Record<number, string> = {
  400: `内容解析失败`,
}
function getError(code: number) {
  return {
    code,
    success: false,
    msg: errObj[code],
    data: null,
  }
};

function formatCode(htmlStr: string) {
  let code = htmlStr
  code = code.replace(/<br>/gi, `\n`)
  code = code.replace(/&nbsp/gi, ` `)
  code = code.replace(/&lt/gi, `<`)
  code = code.replace(/&gt/gi, `>`)
  code = code.replace(/&amp/gi, `&`)
  code = code.replace(/&quot/gi, `"`)
  code = code.replace(/&apos/gi, `\u2018`)
  code = code.replace(/&times/gi, `*`)
  code = code.replace(/&divide/gi, `%`)
  const $ = cheerio.load(code)
  return $.text()
}
function figure2markdown(figureHTML: string) {
  const imgRegex = /<img.*?data-src=['"](.*?)['"]/
  const descRegex = /<figcaption [^>]*>(.+)<\/figcaption>/
  const imgArr = figureHTML.match(imgRegex)
  const descArr = figureHTML.match(descRegex)
  let imgUrl = ``
  let desc = ``
  if (Array.isArray(imgArr)) {
    imgUrl = imgArr[1]
  }
  if (Array.isArray(descArr)) {
    desc = descArr[1]
  }
  if (imgUrl) {
    return `

 ![${desc}](${imgUrl}) 

`
  }
}
function getTurnDownService(meta: { url: string }) {
  const turndownService = new TurndownService({
    codeBlockStyle: `fenced`,
    hr: ``,
  })
  const gfm = turndownPluginGfm.gfm
  turndownService.use(gfm)
  let videoCounter = 0
  turndownService.addRule(`pre2Code`, {
    filter: [`pre`],
    replacement(content, node) {
      const len = content.length
      const isCode = content[0] === `\`` && content[len - 1] === `\``
      let pre_Markdown = ``
      if (isCode) {
        pre_Markdown = formatCode((node as HTMLElement).innerHTML)
      }
      const res = isCode ? pre_Markdown : content
      return `\`\`\`\n${res}\n\`\`\`\n`
    },
  }).addRule(`getImage`, {
    filter: [`img`],
    replacement(content, node) {
      const src = (node as HTMLElement).getAttribute(`data-src`) || ``
      return src
        ? `

![](${src}) 

`
        : ``
    },
  }).addRule(`video`, {
    filter: (node) => {
      return node.tagName.toLowerCase() === `iframe` && node.className.includes(`video_iframe`)
    },
    replacement(content, _node) {
      const node = _node
      const cover = decodeURIComponent((node as HTMLElement).getAttribute(`data-cover`) || ``)
      const u = new URL(meta.url)
      u.hash = `js_mp_video_container_${videoCounter++}`
      return cover
        ? `

[![](${cover})](${u.href}) 

`
        : ``
    },
  }).addRule(`lineBreaks`, {
    filter: `br`,
    replacement: () => `\n`,
  }).addRule(`img2Code`, {
    filter: [`figure`],
    replacement(content, node) {
      const res = figure2markdown((node as HTMLElement).innerHTML)
      return res || ``
    },
  })
  return turndownService
}

function parseHTML(htmlRaw: string, meta: { url: string }) {
  let _a
  const $ = cheerio.load(htmlRaw)
  let title = $(`#activity-name`).text()
  title = title.trim() || ``
  const author = Array.from(new Set([
    // eslint-disable-next-line no-cond-assign
    (_a = $(`meta[name="author"]`)) == null ? void 0 : _a.attr(`content`),
    ...$(`#js_name`).text().split(`\n`),
  ].map(item => item ? item.trim() : ``).filter(Boolean))).join(`\n`)
  const htmlEl = $(`#js_content`)
  const html = htmlEl.html()
  if (html && html.length > 0) {
    let res = getTurnDownService(meta).turndown(html)
    res = `## ${title} 
 
## \u4F5C\u8005 ${author} 
 
${res}`
    return {
      success: true,
      code: Status.Success,
      data: {
        title,
        author,
        content: res,
      },
    }
  }
  return getError(Status.Fail)
}
export async function transformUrl2Markdown(u: string) {
  const url = new URL(u)
  url.searchParams.delete(`poc_token`)
  try {
    const res = await ofetch(url.href, {
      timeout: 5000,
      headers: {
        'DNT': `1`,
        'Upgrade-Insecure-Requests': `1`,
        'User-Agent': `Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36`,
      },
    })
    return parseHTML(res as string, { url: url.href })
  }
  catch (err) {
    console.log(err)
    return getError(Status.Fail)
  }
}
export async function transformHtml2Markdown(htmlRaw: string) {
  try {
    return parseHTML(htmlRaw, { url: window.location.href })
  }
  catch (err) {
    console.log(err)
    return getError(Status.Fail)
  }
}
