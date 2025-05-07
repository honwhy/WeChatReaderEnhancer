<script setup lang="ts">
const socialLinks = [
  {
    name: `即刻`,
    url: `https://web.okjike.com/u/ec41d7d5-407d-4395-ac8a-bd0f04fb202c`,
    icon: browser.runtime.getURL(`/logo/jike.png`),
  },
  {
    name: `哔哩哔哩`,
    url: `https://space.bilibili.com/444418069`,
    icon: browser.runtime.getURL(`/logo/blibli.png`),
  },
  {
    name: `小红书`,
    url: `https://www.xiaohongshu.com/user/profile/63eccfa2000000002600707d`,
    icon: browser.runtime.getURL(`/logo/xhs.png`),
  },
]
</script>

<template>
  <div class="wechat-toc-footer">
    <div class="wechat-toc-footer-links">
      <a
        v-for="item in socialLinks" :key="item.name" :href="item.url"
        target="_blank" rel="noopener noreferrer"
        class="wechat-toc-footer-link"
        :title="`访问我的${item.name}主页`"
      >
        <img :src="item.icon" :alt="item.name" class="wechat-toc-footer-icon">
      </a>
    </div>
  </div>
</template>
