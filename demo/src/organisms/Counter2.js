import makeOrganism from '../../../src'
import Counter from '../components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
})
