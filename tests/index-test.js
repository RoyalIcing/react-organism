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
    delayedIncrement,
    initial
  }
}) {
  return (
    <div>
      <button id='decrement' onClick={ decrement } children='−' />
      <span>{ count }</span>
      <button id='increment' onClick={ increment } children='+' />
      { delayedIncrement &&
        <button id='delayedIncrement' onClick={ delayedIncrement } children='+' />
      }
      <button id='initial' onClick={ initial } children='Reset' />
    </div>
  )
}

describe('makeOrganism', () => {
  let node;
  const $ = (selector) => node.querySelector(selector)
  const promiseRender = (element) => new Promise((resolve) => {
    render(element, node, resolve)  
  })

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Sends click events', async () => {
    let changeCount = 0
    const delayWait = 20

    const CounterOrganism = makeOrganism(Counter, {
      initial: ({ initialCount = 0 }) => ({ count: initialCount }),
      increment: () => ({ count }) => ({ count: count + 1 }),
      decrement: () => ({ count }) => ({ count: count - 1 }),
      delayedIncrement: async () => {
        await waitMs(delayWait)
        return ({ count }) => ({ count: count + 1 })
      }
    }, {
      onChange() {
        changeCount++
      }
    })

    await promiseRender(<CounterOrganism initialCount={ 2 } />)
    expect(node.innerHTML).toContain('2')

    // Click increment
    ReactTestUtils.Simulate.click($('#increment'))
    expect(node.innerHTML).toContain('3')

    // Click decrement
    ReactTestUtils.Simulate.click($('#decrement'))
    expect(node.innerHTML).toContain('2')

    expect(changeCount).toBe(2)

    // Click delayedIncrement
    ReactTestUtils.Simulate.click($('#delayedIncrement'))
    await waitMs(delayWait + 5)
    expect(node.innerHTML).toContain('3')

    expect(changeCount).toBe(3)
  })

  it('Calls load handler', async () => {
    let changeCount = 0
    let latestState;
    const loadWait = 35

    const CounterOrganism = makeOrganism(Counter, {
      initial: ({ initialCount = 0 }) => ({ count: initialCount }),
      load: async ({ loadedCount }, prevProps) => {
        if (!prevProps || loadedCount !== prevProps.loadedCount) {
          await waitMs(loadWait)
          const count = loadedCount * 2 // Multiply to be sure we are using this loaded value
          if (Number.isNaN(count)) {
            throw new Error('Loaded count is invalid')
          }
          return { count }
        }
      },
      increment: () => ({ count }) => ({ count: count + 1 }),
      decrement: () => ({ count }) => ({ count: count - 1 })
    }, {
      onChange(state) {
        latestState = state
        changeCount++
      }
    })

    await promiseRender(<CounterOrganism initialCount={ 2 } loadedCount={ 7 } />)
    expect(node.innerHTML).toContain('2')

    // Click increment
    ReactTestUtils.Simulate.click($('#increment'))
    expect(node.innerHTML).toContain('3')

    // Click decrement
    ReactTestUtils.Simulate.click($('#decrement'))
    expect(node.innerHTML).toContain('2')

    expect(changeCount).toBe(2)

    await waitMs(loadWait + 5)
    expect(node.innerHTML).toContain(14)
    expect(changeCount).toBe(3)

    await promiseRender(<CounterOrganism initialCount={ 22 } loadedCount={ 7 } />)
    expect(node.innerHTML).toContain(14)
    expect(changeCount).toBe(3)

    await promiseRender(<CounterOrganism initialCount={ 22 } loadedCount={ 9 } />)
    await waitMs(loadWait + 5)

    expect(node.innerHTML).toContain(18)
    expect(changeCount).toBe(4)

    try {
      await promiseRender(<CounterOrganism initialCount={ 22 } loadedCount='Not a number' />)
    }
    catch (error) {
      expect(error).toNotExist()
    }
    await waitMs(loadWait + 15)

    expect(latestState.loadError).toExist()
  })

})
