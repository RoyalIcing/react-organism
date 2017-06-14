import makeOrganism from '../../../src'
import * as loadItemsState from '../state/placeholderAPI'
import Items from '../components/Items'

// export default makeOrganism(Items, loadItemsState)

const baseURL = 'https://jsonplaceholder.typicode.com'
const fetchAPI = (path) => fetch(baseURL + path).then(r => r.json())

export default makeOrganism(Items, {
  initial: () => ({ items: null }),

  load: async ({ path }, prevProps, { handlers }) => {
    if (!prevProps || path !== prevProps.path) {
      handlers.initial()
      return { items: await fetchAPI(path) }
    }
  }
})
