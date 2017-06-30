import React, { Component } from 'react'

export default function PhotosList({
  photosList,
  handlers: {
    addRandomPhoto,
    addPhoto
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
        <form data-extract data-reset onSubmit={ addPhoto }>
          <label>
            {'URL: '}
            <input type='url' name='url' />
          </label>
          <button type='submit' children='Add photo' />
        </form>
      </div>
      <div>
        <button onClick={ addRandomPhoto } children='Add random photo' />
      </div>
    </div>
  )
}