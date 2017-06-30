export const initial = () => ({
  photosList: []
})

const fetchRandomPhotoURL = () =>
  fetch(
    'https://source.unsplash.com/random/800x600',
    { method: 'HEAD', cache: 'no-cache' }
  )
    .then(res => res.url)

export const load = async (props, prevProps) => {
  if (!prevProps) {
    const url = await fetchRandomPhotoURL()
    return ({ photosList }) => ({ photosList: photosList.concat({ url }) })
  }
}

export const addPhoto = (props, { url }) => ({ photosList }) => ({ photosList: photosList.concat({ url }) })

export const addRandomPhoto = async (props) => {
  const url = await fetchRandomPhotoURL()
  return addPhoto({}, { url })
}