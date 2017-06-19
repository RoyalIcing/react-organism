import React, { Component } from 'react'

export default function PhotosList({
  photosList,
  handlers: {
    addPhoto
  }
}) {
  return (
    <div>
      {
        !!photosList ? (
          photosList.map((photo, index) => (
            <div key={ index }>
              URL: { photo.url }
            </div>
          ))
        ) : (
          'Loading…'
        )
      }
      <div>
        <button onClick={ () => addPhoto({ url: 'https://example.org/' }) } children='Add photo' />
      </div>
    </div>
  )
}