import type { PluginOption } from 'vite'

function strToUtf8(str: string) {
  return str.split(``).map(ch =>
    ch.charCodeAt(0) <= 0x7F
      ? ch
      : `\\u${(`0000${ch.charCodeAt(0).toString(16)}`).slice(-4)}`).join(``)
}

export default function toUtf8(): PluginOption {
  return {
    name: `to-utf8`,
    enforce: `post`,
    generateBundle(options: any, bundle: any) {
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type === `chunk`) {
          const originCode = file.code
          const modifiedCode = strToUtf8(originCode)
          file.code = modifiedCode
        }
      }
    },
  }
}
