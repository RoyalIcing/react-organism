import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import makeOrganism from 'src/'
import extractFromDOM from 'src/adjustArgs/extractFromDOM'

function PhotosList({
  photosList,
  selectedPhotoIndex,
  handlers: {
    addPhoto,
    selectPhotoAtIndex
  }
}) {
  return (
    <div>
      <div id='selectionStatus'>
      {
        selectedPhotoIndex == null ? (
          'No photo selected'
        ) : (
          `Selected ${selectedPhotoIndex}`
        )
      }
      </div>
      <div id='photos'>
      {
        photosList.length > 0 ? (
          photosList.map((photo, index) => (
            <button key={ index }
              id={`photo-${index}`}
              data-index_number={ index }
              onClick={ selectPhotoAtIndex }
              >
              <img src={ photo.url } />
            </button>
          ))
        ) : (
          'No photos'
        )
      }
      </div>
      <div>
        <form id='addPhotoForm' data-extract data-reset onSubmit={ addPhoto }>
          <label>
            {'URL: '}
            <input id='urlField' type='url' name='url' />
          </label>
          <button id='addPhoto' type='submit' children='Add photo' />
        </form>
      </div>
    </div>
  )
}

describe('makeOrganism', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Reads form values', (done) => {
    const PhotosListOrganism = makeOrganism(PhotosList, {
      initial: () => ({
        photosList: [],
        selectedPhotoIndex: null
      }),
      addPhoto: (props, { url }) => ({ photosList }) => ({ photosList: photosList.concat({ url }) }),
      selectPhotoAtIndex: (props, { index }) => ({ selectedPhotoIndex: index })
    }, {
      adjustArgs: extractFromDOM
    })
    const $ = (selector) => node.querySelector(selector)
    render(<PhotosListOrganism />, node, () => {
      expect($('#photos').innerHTML).toContain('No photos')

      $('#urlField').value = 'https://via.placeholder.com/350x150'
      ReactTestUtils.Simulate.change($('#urlField'))

      ReactTestUtils.Simulate.submit($('#addPhotoForm'))
      expect($('#photos').innerHTML).toContain('https://via.placeholder.com/350x150')

      expect($('#selectionStatus').innerHTML).toContain('No photo selected')
      ReactTestUtils.Simulate.click($('#photo-0'))
      expect($('#selectionStatus').innerHTML).toContain('Selected 0')

      done()
    })
  })

})
