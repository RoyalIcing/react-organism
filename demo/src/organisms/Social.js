import React from 'react'
import makeMultiCelledOrganism from '../../../src/multi'
import PhotosList from '../components/PhotosList'
import FriendsList from '../components/FriendsList'
import Notifications from '../components/Notifications'

import * as friends from '../state/friends'
import * as photos from '../state/photos'

function Social({
  props,
  cells
}) {
  return (
    <div>
      <Notifications friends={ cells.friends } photos={ cells.photos } />
      <FriendsList { ...cells.friends } />
      <PhotosList { ...cells.photos } />
    </div>
  )
}

export default makeMultiCelledOrganism(Social, {
  friends,
  photos
})