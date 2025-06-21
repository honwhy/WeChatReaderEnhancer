# WeChat Reader Enhancer - Privacy Policy

**Last Updated:** May 3, 2025

Welcome to the WeChat Reader Enhancer Chrome extension! We highly value your privacy and are committed to protecting your personal information. This privacy policy explains how we handle data related to this extension.

## 1. No Collection of Personal Information

We solemnly promise: **The WeChat Reader Enhancer extension does not collect, store, use, or share any information that can identify you personally (personal information).**

The core features of this extension, such as:

- Generating a table of contents for WeChat articles.
- Providing enhanced image viewing functionality.

All these processes are completed locally in your browser. Your browsing history, reading content, or interactions with WeChat articles are never transmitted to our servers or any third parties.

## 2. Only Necessary Settings Information is Stored

To provide a personalized experience, such as remembering your preferred sidebar width for the table of contents, this extension uses Chrome's `chrome.storage.sync` API. This API will:

- **Store your settings data in your local browser.**
- **Synchronize** it via your Google account, so you can use the same settings across different devices.

The stored settings information (such as the sidebar width value) **does not contain any personally identifiable information**. As developers, **we cannot access** the data stored and synchronized via `chrome.storage.sync`. This data is entirely controlled by you and your Google account.

## 3. No Third-Party Services or Tracking

This extension does not integrate any third-party analytics services, advertising services, or trackers. We do not track your online activities.

## 4. Permission Explanation

This extension requires the following permissions to function properly:

- `storage`: Used to store your preference settings (as described in point 2 above).
- `host_permissions` (for `https://mp.weixin.qq.com/*`): Used to inject scripts into WeChat article pages to generate the table of contents and enhance image viewing. This permission is limited to running on the specified WeChat domain and does not access data from other websites.

We adhere to the principle of least privilege and only request permissions necessary for core functionality.

## 5. Changes to the Privacy Policy

If we make any significant changes to this privacy policy in the future, we will notify you through the extension's update notes or other appropriate means.

## 6. Contact Us

If you have any questions or concerns about this privacy policy, please contact us via:

- Submitting an Issue on our GitHub repository: [https://github.com/honwhy/WeChatReaderEnhancer/issues](https://github.com/honwhy/WeChatReaderEnhancer/issues)

Thank you for