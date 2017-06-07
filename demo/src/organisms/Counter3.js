import makeOrganism from '../../../src'
import Counter from '../components/Counter'

const localStorageKey = 'counter3'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  load: async () => {
    return await JSON.parse(localStorage.getItem(localStorageKey))
  },
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
}, {
  onChange(state) {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
})
