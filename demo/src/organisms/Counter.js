import makeOrganism from '../../../src'
import * as counterState from '../state/counter'
import Counter from '../components/Counter'

//export default makeOrganism(Counter, counterState)

export default makeOrganism(Counter, {
  initial: () => ({ count: 0 }),
  increment: () => ({ count }) => ({ count: count + 1 }),
  decrement: () => ({ count }) => ({ count: count - 1 })
})
