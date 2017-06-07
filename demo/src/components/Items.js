import React, { Component } from 'react'

export default function Counter({
  items,
  collectionName,
  handlers: {
    load
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
        <button onClick={ load } children='Reload' />
      </div>
    </div>
  )
}