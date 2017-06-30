export default () => new Promise((resolve) => {
  window.requestAnimationFrame(resolve)
})
