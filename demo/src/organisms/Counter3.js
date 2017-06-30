import makeOrganism from '../../../src'
import Counter from '../components/Counter'

const localStorageKey = 'counter3'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 13 }) => ({ count: initialCount }),
  load: async (props, prevProps) => {
    if (!prevProps) {
      // Try commenting out:
      /* throw (new Error('Oops!')) */

      // Load previously stored state, if present
      return await JSON.parse(localStorage.getItem(localStorageKey))
    }
  },
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
}, {
  onChange(state) {
    // When state changes, save in local storage
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
})
