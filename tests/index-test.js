import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import makeOrganism from 'src/'

const waitMs = duration => new Promise(resolve => setTimeout(resolve, duration))

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
    let changeCount = 0

    const CounterOrganism = makeOrganism(Counter, {
      initial: ({ initialCount = 0 }) => ({ count: initialCount }),
      increment: () => ({ count }) => ({ count: count + 1 }),
      decrement: () => ({ count }) => ({ count: count - 1 })
    }, {
      onChange() {
        changeCount++
      }
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

      expect(changeCount).toBe(2)

      done()
    })
  })

  it('Calls load handler', (done) => {
    let changeCount = 0
    const loadWait = 35

    const CounterOrganism = makeOrganism(Counter, {
      initial: ({ initialCount = 0 }) => ({ count: initialCount }),
      load: async ({ loadedCount }, prevProps) => {
        if (!prevProps || loadedCount !== prevProps.loadedCount) {
          await waitMs(loadWait)
          return { count: loadedCount * 2 } // Multiply to be sure we are using this loaded value
        }
      },
      increment: () => ({ count }) => ({ count: count + 1 }),
      decrement: () => ({ count }) => ({ count: count - 1 })
    }, {
      onChange() {
        changeCount++
      }
    })
    const $ = (selector) => node.querySelector(selector)
    render(<CounterOrganism initialCount={ 2 } loadedCount={ 7 } />, node, () => {
      expect(node.innerHTML).toContain('2')

      // Click increment
      ReactTestUtils.Simulate.click($('#increment'))
      expect(node.innerHTML).toContain('3')

      // Click decrement
      ReactTestUtils.Simulate.click($('#decrement'))
      expect(node.innerHTML).toContain('2')

      expect(changeCount).toBe(2)

      setTimeout(() => {
        expect(node.innerHTML).toContain(14)
        expect(changeCount).toBe(3)

        render(<CounterOrganism initialCount={ 22 } loadedCount={ 7 } />, node, () => {
          expect(node.innerHTML).toContain(14)
          expect(changeCount).toBe(3)

          render(<CounterOrganism initialCount={ 22 } loadedCount={ 9 } />, node, () => {
            setTimeout(() => {
              expect(node.innerHTML).toContain(18)
              expect(changeCount).toBe(4)

              done()
            }, loadWait + 5)
          })
        })
      }, loadWait + 5)
    })
  })

})
