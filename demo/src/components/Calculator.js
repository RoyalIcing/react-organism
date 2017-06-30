import React, { Component } from 'react'

export default function Calculator({
  value,
  handlers: {
    changeValue,
    double,
    add3,
    initial
  }
}) {
  return (
    <div className='h-spaced'>
      <input value={ value } onChange={ changeValue } />
      <button onClick={ double } children='Double' />
      <button onClick={ add3 } children='Add 3' />
      <button onClick={ initial } children='Reset' />
    </div>
  )
}