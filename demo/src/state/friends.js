export const initial = () => ({ friendsList: [] })

export const addFriend = (props, { name }) => ({ friendsList }) => ({ friendsList: friendsList.concat({ name }) })