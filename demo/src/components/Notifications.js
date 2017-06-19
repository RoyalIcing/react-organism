import React from 'react'

export default function Notifications({
  friends,
  photos
}) {
  return (
    <div>
      { friends && `${friends.friendsList.length} friends` }
      { ' ' }
      { photos && `${photos.photosList.length} photos` }
    </div>
  )
}