import makeOrganism from '../../../src'
import Counter from '../components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: () => ({ count }, { stride = 1 }) => ({ count: count + stride }),
  decrement: () => ({ count }, { stride = 1 }) => ({ count: count - stride })
})
