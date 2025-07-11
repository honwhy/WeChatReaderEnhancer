import { BrowserQRCodeReader } from '@zxing/browser'
import { onMounted } from 'vue'

const reader = new BrowserQRCodeReader()

async function scanImageForQRCode(imgElement: HTMLImageElement): Promise<string | null> {
  try {
    imgElement.crossOrigin = `Anonymous`
    const result = await reader.decodeFromImageElement(imgElement)
    return result.getText()
  }
  catch (e) {
    console.error(`Error decoding QR code:`, e)
    return null // Not a QR code or unreadable
  }
}

function isWrappedInAnchor(img: HTMLImageElement): boolean {
  return img.closest(`a`) !== null
}

function wrapImageWithLink(img: HTMLImageElement, url: string) {
  const a = document.createElement(`a`)
  a.href = url
  a.target = `_blank`
  img.parentNode!.insertBefore(a, img)
  a.appendChild(img)
}

async function processImages() {
  const images = Array.from(document.images)
  for (const img of images) {
    const qrContent = await scanImageForQRCode(img)
    if (qrContent && /^https?:\/\//i.test(qrContent)) {
      if (!isWrappedInAnchor(img)) {
        wrapImageWithLink(img, qrContent)
        console.log(`Wrapped image with link: ${qrContent}`)
      }
    }
  }
}

// Initial scan
// processImages()

export function useScanImages() {
  onMounted(() => {
    processImages()
  })
}
// Optional: watch for dynamic image insertions
// const observer = new MutationObserver(() => {
//   processImages()
// })

// observer.observe(document.body, { childList: true, subtree: true })
