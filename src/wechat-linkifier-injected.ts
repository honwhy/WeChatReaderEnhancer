export default defineUnlistedScript(() => {
  // 添加全局事件监听器来处理链接的悬停效果
  document.addEventListener(`mouseover`, (e) => {
    if (e.target && e.target instanceof HTMLElement && e.target.classList && e.target.classList.contains(`linkified`)) {
      e.target.style.textDecoration = `underline`
    }
  }, true)

  document.addEventListener(`mouseout`, (e) => {
    if (e.target && e.target instanceof HTMLElement && e.target.classList && e.target.classList.contains(`linkified`)) {
      e.target.style.textDecoration = `none`
    }
  }, true)
})
