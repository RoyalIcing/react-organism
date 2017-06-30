import React from 'react'

const style = {
  display: 'flex',
  flexDirection: 'row'
}

export default function Row({
  children
}) {
  return (
    <div style={ style } children={ children } />
  )
}