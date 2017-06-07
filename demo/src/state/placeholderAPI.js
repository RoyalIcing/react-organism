const baseURL = 'https://jsonplaceholder.typicode.com'
const fetchAPI = (path) => fetch(baseURL + path).then(r => r.json())

export const initial = () => ({ items: null })

export const load = async ({ path }, prevProps) => {
  if (!prevProps || path !== prevProps.path) {
    console.log('load', path)
    return { items: await fetchAPI(path) }
  }
}
