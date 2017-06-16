import React, { Component } from 'react'

export default function Counter({
  count,
  handlers: {
    increment,
    decrement,
    initial
  }
}) {
  return (
    <div className='h-spaced'>
      <button onClick={ decrement } children='−' />
      <span>{ count }</span>
      <button onClick={ increment } children='+' />
      <button onClick={ initial } children='Reset' />
    </div>
  )
}