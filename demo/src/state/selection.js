export const initial = () => ({
  selectedFriendIndex: null,
  selectedPhotoIndex: null
})

export const selectFriendAtIndex = (props, { index }) => ({ selectedFriendIndex: index })
export const selectPhotoAtIndex = (props, { index }) => ({ selectedPhotoIndex: index })
