export const initial = () => ({
  photosList: []
})

export const addPhoto = (props, { url }) => ({ photosList }) => ({ photosList: photosList.concat({ url }) })

export const addRandomPhoto = async ({ handlers }) => {
  const photoResponse = await fetch(
    'https://source.unsplash.com/random/800x600',
    { method: 'HEAD', cache: 'no-cache' }
  )
  handlers.addPhoto({ url: photoResponse.url })
}