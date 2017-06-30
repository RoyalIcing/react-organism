import makeOrganism from '../../../src'
import nextFrame from '../../../src/nextFrame'
import Counter from '../components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  offsetBy: (props, change) => ({ count }) => ({ count: count + change }),
  increment: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await nextFrame()
      await handlers.offsetBy(1)
      stride -= 1
    }
  },
  decrement: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await nextFrame()
      await handlers.offsetBy(-1)
      stride -= 1
    }
  }
})
