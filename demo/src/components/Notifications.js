import React from 'react'

export default function Notifications({
  friends: {
    friendsList
  },
  photos: {
    photosList
  }
}) {
  return (
    <div>
      { `${friendsList.length} friends` }
      { ' | ' }
      { `${photosList.length} photos` }
    </div>
  )
}