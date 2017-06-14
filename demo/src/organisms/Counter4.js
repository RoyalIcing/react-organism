import makeOrganism from '../../../src'
import Counter from '../components/Counter'

const wait = async function(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const waitNextFrame = async function() {
  await new Promise((resolve) => {
    window.requestAnimationFrame(resolve)
  })
}

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  _offsetBy: (props, change) => ({ count }) => ({ count: count + change }),
  increment: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await waitNextFrame()
      await handlers._offsetBy(1)
      stride -= 1
    }
  },
  decrement: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await waitNextFrame()
      await handlers._offsetBy(-1)
      stride -= 1
    }
  }
})
