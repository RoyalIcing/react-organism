import React from 'react'
import makeOrganism from '../../../src'
import ItemsOrganism from './Items'

export default makeOrganism(({
  collection,
  handlers: {
    selectPosts,
    selectPhotos,
    selectTodos
  }
}) => (
  <div>
    <div className='h-spaced'>
      <button onClick={ selectPosts }>Posts</button>
      <button onClick={ selectPhotos }>Photos</button>
      <button onClick={ selectTodos }>Todos</button>
    </div>
    <ItemsOrganism path={ '/' + collection } collectionName={ collection } />
  </div>
), {
  initial: () => ({ collection: 'posts' }),
  selectPosts: () => ({ collection: 'posts' }),
  selectPhotos: () => ({ collection: 'photos' }),
  selectTodos: () => ({ collection: 'todos' })
})