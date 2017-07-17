import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import makeMulticelledOrganism from 'src/multi'

const waitMs = duration => new Promise(resolve => setTimeout(resolve, duration))

function Counter({
  id,
  count,
  title,
  handlers: {
    increment,
    decrement,
    initial,
    changeTitle,
    uppercaseTitle,
    makeTitleHeading
  }
}) {
  return (
    <div>
      <h2 id={`${id}-title`}>{ title }</h2>
      <button id={`${id}-decrement`} onClick={ decrement } children='−' />
      <span id={`${id}-currentCount`}>{ id }: { count }</span>
      <button id={`${id}-increment`} onClick={ increment } children='+' />
      <button id={`${id}-initial`} onClick={ initial } children='Reset' />

      <input id={`${id}-changeTitle`} onChange={ changeTitle } />
      <button id={`${id}-uppercaseTitle`} onClick={ uppercaseTitle } children='uppercaseTitle' />
      <button id={`${id}-makeTitleHeading`} onClick={ makeTitleHeading } children='makeTitleHeading' />
    </div>
  )
}

const counterModel = {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: () => ({ count }) => ({ count: count + 1 }),
  decrement: () => ({ count }) => ({ count: count - 1 })
}

const loadWait = 35
const counterLoadModel = {
  initial: ({ initialCount = 0 }) => ({
    count: initialCount,
    title: 'Counter'
  }),
  load: async ({ loadedCount }, prevProps) => {
    if (!prevProps || loadedCount !== prevProps.loadedCount) {
      await waitMs(loadWait)
      return { count: loadedCount * 2 } // Multiply to be sure we are using this loaded value
    }
  },
  increment: () => ({ count }) => ({ count: count + 1 }),
  decrement: () => ({ count }) => ({ count: count - 1 }),
  changeTitle: (props, { value }) => ({ title: value }),
  uppercaseTitle: () => ({ title }) => ({ title: title.toUpperCase() }),
  makeTitleHeading: () => ({ title: 'Heading' })
}

describe('makeMulticelledOrganism', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Sends click events', (done) => {
    let changeCount = 0

    const Organism = makeMulticelledOrganism(({
      cells: {
        counterA,
        counterB
      }
    }) => (
      <div>
        <Counter id='a' { ...counterA } />
        <Counter id='b' { ...counterB } />
      </div>
    ), {
      counterA: counterModel,
      counterB: counterModel
    }, {
      onChange() {
        changeCount++
      }
    })

    const $ = (selector) => node.querySelector(selector)
    render(<Organism initialCount={ 2 } />, node, () => {
      const $aCurrentCount = $('#a-currentCount')
      const $bCurrentCount = $('#b-currentCount')
      expect($aCurrentCount.textContent).toBe('a: 2')
      expect($bCurrentCount.textContent).toBe('b: 2')

      // Click increment
      ReactTestUtils.Simulate.click($('#a-increment'))
      expect($aCurrentCount.textContent).toBe('a: 3')
      expect($bCurrentCount.textContent).toBe('b: 2')

      // Click decrement
      ReactTestUtils.Simulate.click($('#a-decrement'))
      expect($aCurrentCount.textContent).toBe('a: 2')
      expect($bCurrentCount.textContent).toBe('b: 2')

      // Click decrement
      ReactTestUtils.Simulate.click($('#b-decrement'))
      expect($aCurrentCount.textContent).toBe('a: 2')
      expect($bCurrentCount.textContent).toBe('b: 1')

      expect(changeCount).toBe(3)

      done()
    })
  })

  it('Calls load handler', (done) => {
    let changeCount = 0
    const loadWait = 35

    const Organism = makeMulticelledOrganism(({
      cells: {
        counterA,
        counterB
      }
    }) => (
      <div>
        <Counter id='a' { ...counterA } />
        <Counter id='b' { ...counterB } />
      </div>
    ), {
      counterA: counterLoadModel,
      counterB: counterLoadModel
    }, {
      onChange() {
        changeCount++
      }
    })

    const $ = (selector) => node.querySelector(selector)
    render(<Organism initialCount={ 2 } loadedCount={ 7 } />, node, () => {
      const $aCurrentCount = $('#a-currentCount')
      const $aTitle = $('#a-title')

      expect($aCurrentCount.textContent).toContain('2')

      // Click increment
      ReactTestUtils.Simulate.click($('#a-increment'))
      expect($aCurrentCount.textContent).toContain('3')

      // Click decrement
      ReactTestUtils.Simulate.click($('#a-decrement'))
      expect($aCurrentCount.textContent).toContain('2')

      expect(changeCount).toBe(2)

      setTimeout(() => {
        // Loaded
        expect($aCurrentCount.textContent).toContain('14')
        expect(changeCount).toBe(4) // Both cells loaded, so change count increases by 2

        render(<Organism initialCount={ 22 } loadedCount={ 7 } />, node, () => {
          // Takes some time to load, so shouldn’t have changed yet
          expect($aCurrentCount.textContent).toContain('14')
          expect(changeCount).toBe(4)

          render(<Organism initialCount={ 22 } loadedCount={ 9 } />, node, () => {
            setTimeout(() => {
              // Loaded from new props
              expect($aCurrentCount.textContent).toContain('18')
              expect(changeCount).toBe(6)

              expect($aTitle.textContent).toBe('Counter')

              ReactTestUtils.Simulate.click($('#a-uppercaseTitle'))
              expect($aTitle.textContent).toBe('COUNTER')

              ReactTestUtils.Simulate.click($('#a-makeTitleHeading'))
              expect($aTitle.textContent).toBe('Heading')

              done()
            }, loadWait + 5)
          })
        })
      }, loadWait + 5)
    })
  })

})
