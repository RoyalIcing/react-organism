import makeOrganism from '../../../src'
import Counter from '../components/Counter'

const localStorageKey = 'counter3'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 13 }) => ({ count: initialCount }),
  load: async (props, prevProps) => {
    if (!prevProps) {
      //throw (new Error('Oops!'));
      return await JSON.parse(localStorage.getItem(localStorageKey))
    }
  },
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
}, {
  onChange(state) {
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
})
