export const initial = () => ({
  selectedFriendIndex: null,
  selectedPhotoIndex: null
})

export const selectFriendAtIndex = (props, args) => {
  console.log('selectFriendAtIndex', JSON.stringify(args))
  return ({ selectedFriendIndex: args.index })
}
export const selectPhotoAtIndex = (props, { index }) => ({ selectedPhotoIndex: index })
