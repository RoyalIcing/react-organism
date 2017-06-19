import React, { Component } from 'react'

export default function PhotosList({
  photosList,
  handlers: {
    addRandomPhoto
  }
}) {
  return (
    <div>
      {
        !!photosList ? (
          photosList.map((photo, index) => (
            <div key={ index }>
              <img src={ photo.url } />
            </div>
          ))
        ) : (
          'Loading…'
        )
      }
      <div>
        <button onClick={ addRandomPhoto } children='Add photo' />
      </div>
    </div>
  )
}