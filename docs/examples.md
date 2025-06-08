# 功能特性

## 生成文章目录

1. **目录生成**

   - 自动识别公众号文章中的 HTML 标题标签（`<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`）
   - 根据标题层级关系生成结构化目录树
   - 在页面侧边栏展示目录

2. **导航跳转**

   - 用户点击目录中的标题可直接跳转到文章对应位置
   - 平滑滚动动画，提升用户体验

3. **位置追踪**

   - 当用户滚动文章时，目录中当前视窗内的标题自动高亮
   - 清晰显示用户当前阅读位置

4. **折叠与展开**
   - 支持多层级目录的折叠与展开
   - 允许用户点击父级标题展开或折叠子标题
   - 默认全部展开，方便用户总览文章结构

## 点击图片放大

使用 [medium-zoom](https://github.com/francoischalifour/medium-zoom) 针对文章图片进行处理。

## 保存阅读进度

将文章URL 进行hash ，并和窗口对象的滚动位置，保存到`sync` 存储中，用户用新的浏览器重新安装插件，重新打开文章，还是可以还原阅读进度。

## 生成外链超链接

使用[linkify-it](https://github.com/markdown-it/linkify-it) 对文章 http/https 链接进行识别，并用 `a` 标签包裹成超链接形式。

## 展示文章二维码

使用[qrcode](https://github.com/soldair/node-qrcode) 为文章制作二维码，在右上角进行展示。

## 文章AI 总结

对接通用大模型进行文章总结，并在文章开头位置插入 `blockquote` 元素进行展示。

提示词，

```text
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
```

API Key 可以通过[阿里云百炼](https://bailian.console.aliyun.com/?tab=api#/api) 进行申请，申请可得百万免费token。

## 阅读时间预估

使用[reading-time](https://github.com/ngryman/reading-time) 阅读文章阅读时长，单位是分钟，预估标准每分钟阅读200个字。

## 支持衬线字体

通过向页面注入样式，当开启衬线字体时在`body`上增加样式类`wre-serif-fonts`，调整页面的字族。

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

## 支持文本对齐

同上原理。

```css
body.wx_wap_page.text-justify p {
  text-align: justify;
}
```

## 识别图片二维码

首先读取页面所有`image` 元素，调整跨域属性`imgElement.crossOrigin = 'Anonymous'`，通过[@zxing/browser](https://github.com/zxing-js/browser) 扫描图片内容获取文本信息。如果可以正确获取文本信息，则判断是否http 开头，是则在图片外层包裹 `a` 标签。

## 去AI 检测

首先获取文章内容，并写入到 浏览器插件的`local` 存储中。
此时如果还未打开 `朱雀大模型`检测网站，则新开浏览器tab 打开，并在`朱雀大模型`网站读取浏览器插件的`local` 存储，填充到文本输入框。

如果此时已打开过，则直接跳转到对应的tab。

## 增加返回顶部按钮

当页面滚动超过200 像素时，右下角会出现「返回顶部」按钮，点击即可返回文章开头位置。