export default async function nextFrame() {
  await new Promise((resolve) => {
    window.requestAnimationFrame(resolve)
  })
}