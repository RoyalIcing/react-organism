import React from 'react'
import makeMultiCelledOrganism from '../../../src/multi'
import argsExtractDOMValues from '../../../src/argsExtractDOMValues'
import PhotosList from '../components/PhotosList'
import FriendsList from '../components/FriendsList'
import Notifications from '../components/Notifications'
import Row from '../components/Row'

import * as friends from '../state/friends'
import * as photos from '../state/photos'
import * as selection from '../state/selection'

const styles = {
  light: {
    color: '#111',
    backgroundColor: '#f6f6f6'
  },
  dark: {
    color: '#f6f6f6',
    backgroundColor: '#222'
  }
}

function Social({
  darkMode = false,
  cells
}) {
  return (
    <div style={ darkMode ? styles.dark : styles.light }>
      <Notifications friends={ cells.friends } photos={ cells.photos } />
      <FriendsList
        { ...cells.friends }
        selectedIndex={ cells.selection.selectedFriendIndex }
        onSelectAtIndex={ cells.selection.handlers.selectFriendAtIndex }
      />
      <PhotosList
        { ...cells.photos }
        selectedIndex={ cells.selection.selectedPhotoIndex }
        onSelectAtIndex={ cells.selection.handlers.selectPhotoAtIndex }
      />
    </div>
  )
}

export default makeMultiCelledOrganism(Social, {
  friends,
  photos,
  selection
}, {
  adjustArgs: argsExtractDOMValues
})