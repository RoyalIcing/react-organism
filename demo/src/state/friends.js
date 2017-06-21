export const initial = () => ({
  friendsList: []
})

export const addFriend = (props, { name }) => ({ friendsList }) => ({ friendsList: friendsList.concat({ name }) })

export const addRandomFriend = async ({ handlers }) => {
  const users = await fetch('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole').then(res => res.json())
  const user = users[0]
  const name = `${user.first} ${user.last}`
  handlers.addFriend({ name })
}