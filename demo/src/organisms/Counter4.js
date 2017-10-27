import makeOrganism from '../../../src'
import Counter from '../components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: function * ({ stride = 20, handlers }) {
    while (stride > 0) {
      yield ({ count }) => ({ count: count + 1 })
      stride -= 1
    }
  },
  decrement: function * ({ stride = 20, handlers }) {
    while (stride > 0) {
      yield ({ count }) => ({ count: count - 1 })
      stride -= 1
    }
  }
})
