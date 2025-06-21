# WeChat Articles Reader Enhancer - Frequently Asked Questions (FAQ)

## Basic Questions

### What does this extension do?

This is a browser extension designed to enhance the reading experience of WeChat articles on desktop. It automatically generates an article table of contents, supports image zooming, and tracks your reading position in real time, making long-form reading more efficient and comfortable.

### Which browsers are supported?

Currently, Chrome and Microsoft Edge browsers are supported. Other Chromium-based browsers (such as Brave, Opera, etc.) may also work in theory, but have not been fully tested.

### Is it free? Are there any ads?

Completely free, no ads, and no user data collection. The extension is open source and the code is fully transparent.

### How to install?

- Chrome: Visit the Chrome Web Store, search for "WeChat Reader Enhancer", and click "Add to Chrome".
- Edge: Visit the Microsoft Edge Add-ons Store, search for "WeChat Reader Enhancer", and click "Get".
- Developer mode: Clone the GitHub repository and follow the development guide in the README to build and load the extension.

### Does it affect privacy or security?

No. The extension only runs on WeChat article pages, does not collect any user data, does not require special permissions, and the code is fully open source and transparent.

## Feature Questions

### Why doesn't the table of contents appear for some articles?

The extension relies on HTML heading tags (h1-h6) in the article to generate the table of contents. If the article does not use standard heading tags, the table of contents may not be generated correctly. If this happens, please provide feedback to us and we will consider adding other methods to identify headings.

### Can I customize the style of the article table of contents?

Currently, custom styles are not supported, but we plan to add this feature in future versions.

### Does the image viewer support zooming or rotating?

The current version only supports image zooming, not scaling or rotating. These features are on our development roadmap.

### Will the extension update automatically?

Yes, as long as your browser has extension auto-update enabled, the extension will update automatically when a new version is released.

### Will the extension slow down article loading?

The extension is performance-optimized and has minimal impact on page load speed. It only starts working after the page is fully loaded and does not affect the initial loading speed of the article.

## Technical Questions

### How adaptable is the extension to changes in WeChat pages?

We closely monitor any changes to WeChat pages and update the extension promptly to ensure compatibility.

### What should I do if I find a bug?

Please report it to us via any of the following methods:

1. Submit an Issue on the GitHub repository
2. Use the feedback form on the official website
3. Contact the developer via social media

### Can this extension be used on other types of websites?

Currently, the extension is designed specifically for WeChat article pages. If you wish to use it on other websites, feel free to suggest it or contribute code on GitHub.

### What is the technical architecture of the extension?

The extension is developed with TypeScript, follows the Manifest V3 specification, and uses modern front-end development practices. For detailed technical architecture, please refer to the README in the GitHub repository.

## Other Questions

### How can I contribute?

You are welcome to contribute in the following ways:

1. Fork the GitHub repository and submit a Pull Request
2. Suggest features or report bugs
3. Improve documentation or provide translations
4. Share and promote the extension on social media

### Are there plans for new features?

Yes, planned features include:

- Custom themes and styles
- Image scaling and rotation
- Article content search
- Reading progress saving
- Night mode support

### How to contact the developer?

You can contact the developer via:

- GitHub repository Issues
- Jike: @黄哲
- Twitter X: @huangzh65903362
- Bilibili: UID 444418069
- Xiaohongshu: ID 63eccfa2000000002600707d

### How can I support this project?

The best way to support is to use the extension and provide feedback to help us improve. If you like the extension, you can also:

1. Leave a positive review in the app store
2. Share on social media
3. Recommend to friends
4. Star the project on