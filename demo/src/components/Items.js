import React, { Component } from 'react'

export default function Counter({
  items,
  collectionName,
  handlers: {
    reload
  }
}) {
  return (
    <div>
      {
        !!items ? (
          `${items.length} ${collectionName}`
        ) : (
          'Loading…'
        )
      }
      <div>
        <button onClick={ reload } children='Reload' />
      </div>
    </div>
  )
}