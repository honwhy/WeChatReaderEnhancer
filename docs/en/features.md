# Features

## Generate Article Table of Contents

1. **Table of Contents Generation**

   - Automatically recognizes HTML heading tags (`<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`) in WeChat articles
   - Generates a structured table of contents tree based on heading hierarchy
   - Displays the table of contents in the page sidebar

2. **Navigation Jump**

   - Users can click on headings in the table of contents to jump directly to the corresponding position in the article
   - Smooth scrolling animation for enhanced user experience

3. **Position Tracking**

   - When users scroll through the article, the heading currently in the viewport is automatically highlighted in the table of contents
   - Clearly shows the user's current reading position

4. **Collapse and Expand**
   - Supports collapsing and expanding multi-level table of contents
   - Allows users to click parent headings to expand or collapse child headings
   - All headings are expanded by default for easy overview of the article structure

## Click to Enlarge Images

Uses [medium-zoom](https://github.com/francoischalifour/medium-zoom) to process images in the article.

## Save Reading Progress

Hashes the article URL and saves it along with the window's scroll position to `sync` storage. When users reinstall the extension or use a new browser, reopening the article will restore the reading progress.

## Generate External Hyperlinks

Uses [linkify-it](https://github.com/markdown-it/linkify-it) to recognize http/https links in the article and wraps them with `a` tags as hyperlinks.

## Display Article QR Code

Uses [qrcode](https://github.com/soldair/node-qrcode) to generate a QR code for the article and displays it in the upper right corner.

## Article AI Summary

Connects to a general-purpose large language model to summarize the article and inserts a `blockquote` element at the beginning of the article for display.

Prompt:

```text
Please write an article summary in Chinese within 100 characters, including the core viewpoint, main arguments, and conclusion. The language should be concise, logically clear, and highlight the core value and innovation points of the article, ensuring information completeness with no omissions.

Optimization instructions:

Structural requirements: Clearly require inclusion of core viewpoint/arguments/conclusion
Quality standards: Add quality dimensions such as "logical clarity" and "highlight key points"
Value orientation: Emphasize the extraction of "core value and innovation points"
Completeness requirement: Add the constraint of "ensuring information completeness"
Professional expression: Use "write" instead of "summarize" to enhance professionalism

Article Title: %title%
Article Content:
%content%
```

API Key can be applied for via [Alibaba Cloud Bailian](https://bailian.console.aliyun.com/?tab=api#/api), which offers millions of free tokens upon application.

## Reading Time Estimation

Uses [reading-time](https://github.com/ngryman/reading-time) to estimate the reading time of the article in minutes, based on a standard of 200 characters per minute.

## Support for Serif Fonts

By injecting styles into the page, when serif fonts are enabled, the style class `wre-serif-fonts` is added to the `body` to adjust the font family.

```css
body.wx_wap_page.wre-serif-fonts {
  font-family:
    SimSun,
    Times New Roman,
    Georgia,
    Merriweather,
    Playfair Display;
}
```

## Support for Text Alignment

Same principle as above.

```css
body.wx_wap_page.text-justify p {
  text-align: justify;
}
```

## Recognize Image QR Codes

First, read all `image` elements on the page, set the cross-origin attribute `imgElement.crossOrigin = 'Anonymous'`, and use [@zxing/browser](https://github.com/zxing-js/browser) to scan the image content for text information. If text information is successfully obtained and starts with http, wrap the image with an `a` tag.

## AI Detection Removal

First, obtain the article content and write it to the browser extension's `local` storage.
If the "Suzaku Large Model" detection website has not been opened, open a new browser tab and read the content from the extension's `local` storage on the "Suzaku Large Model" website, filling it into the text input box.

If it has already been opened, directly switch to the corresponding tab.

## Add Back to Top Button

When the page is scrolled more than 200 pixels, a "Back to Top" button appears in the lower right corner. Clicking it returns to the beginning of the article.