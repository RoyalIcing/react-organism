import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import makeOrganism from 'src/'

function Counter({
  count,
  handlers: {
    increment,
    decrement,
    initial
  }
}) {
  return (
    <div>
      <button id='decrement' onClick={ decrement } children='−' />
      <span>{ count }</span>
      <button id='increment' onClick={ increment } children='+' />
      <button id='initial' onClick={ initial } children='Reset' />
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

  it('Sends click events', (done) => {
    const CounterOrganism = makeOrganism(Counter, {
      initial: ({ initialCount = 0 }) => ({ count: initialCount }),
      increment: () => ({ count }) => ({ count: count + 1 }),
      decrement: () => ({ count }) => ({ count: count - 1 })
    })
    const $ = (selector) => node.querySelector(selector)
    render(<CounterOrganism initialCount={ 2 } />, node, () => {
      expect(node.innerHTML).toContain('2')

      // Click increment
      ReactTestUtils.Simulate.click($('#increment'))
      expect(node.innerHTML).toContain('3')

      // Click decrement
      ReactTestUtils.Simulate.click($('#decrement'))
      expect(node.innerHTML).toContain('2')

      done()
    })
  })

})
