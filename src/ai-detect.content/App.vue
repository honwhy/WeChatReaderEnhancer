<script lang="ts" setup>
import { onMounted } from 'vue'
import { getArticleContent, watchArticleContent } from '../utils/storage'

const unwatch = watchArticleContent((newContent, _oldContent) => {
  if (newContent) {
    const container = document.querySelector(`.txt-input textarea`)
    if (container) {
      container.value = newContent
      container.dispatchEvent(new Event(`input`)) // Trigger input event to update any bindings
    }
  }
})
onMounted(async () => {
  console.log(`AI Detect Content Script Loaded`)
  const content = await getArticleContent()
  const container = document.querySelector(`.txt-input textarea`)
  if (content && container) {
    container.value = content
    container.dispatchEvent(new Event(`input`)) // Trigger input event to update any bindings
  }
})
onUnmounted(() => {
  unwatch()
})
</script>

<template>
  <div />
</template>
