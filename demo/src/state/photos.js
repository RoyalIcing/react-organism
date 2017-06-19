export const initial = () => ({ photosList: [] })

export const addPhoto = (props, { url }) => ({ photosList }) => ({ photosList: photosList.concat({ url }) })