export default defineUnlistedScript(() => {
  const btn = document.createElement(`button`)
  btn.id = `we-toc-up-to-top-btn`
  btn.textContent = `↑ 返回顶部`
  Object.assign(btn.style, {
    position: `fixed`,
    bottom: `30px`,
    right: `30px`,
    padding: `8px 12px`,
    backgroundColor: `#07C160`,
    color: `#fff`,
    border: `none`,
    borderRadius: `6px`,
    cursor: `pointer`,
    fontSize: `14px`,
    boxShadow: `0 2px 6px rgba(0,0,0,0.2)`,
    zIndex: 9999,
    display: `none`,
  })

  btn.addEventListener(`click`, () => {
    window.scrollTo({ top: 0, behavior: `smooth` })
  })

  document.body.appendChild(btn)

  window.addEventListener(`scroll`, () => {
    btn.style.display = window.scrollY > 200 ? `block` : `none`
  })
})
