export const initial = () => ({
  friendsList: []
})

const convertUserToFriend = (user) => ({
  name: `${user.first} ${user.last}`
})

const fetchRandomFriends = () =>
  fetch('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole')
    .then(res => res.json())
    .then(users => users.map(convertUserToFriend))

export const load = async (props, prevProps) => {
  if (!prevProps) {
    const newFriends = await fetchRandomFriends()
    return ({ friendsList }) => ({ friendsList: friendsList.concat(newFriends) })
  }
}

export const addFriend = (props, { name }) => ({ friendsList }) => ({ friendsList: friendsList.concat({ name }) })

export const addRandomFriend = async ({ handlers }) => {
  const [ newFriend ] = await fetchRandomFriends()
  handlers.addFriend(newFriend)
}