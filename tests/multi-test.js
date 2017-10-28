import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils'

import makeMulticelledOrganism from 'src/multi'

const waitMs = duration => new Promise(resolve => setTimeout(resolve, duration))

const nextFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(resolve)
})

function Counter({
  id,
  count,
  title,
  handlers: {
    increment,
    decrement,
    delayedIncrement,
    delayedIncrementGenerator,
    doNothing,
    blowUp,
    blowUp2,
    blowUpDelayed,
    initial,
    load,
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
      { delayedIncrement &&
        <button id={`${id}-delayedIncrement`} onClick={ delayedIncrement } children='+' />
      }
      { delayedIncrementGenerator &&
        <button id={`${id}-delayedIncrementGenerator`} onClick={ delayedIncrementGenerator } children='+' />
      }
      { doNothing &&
        <button id={`${id}-doNothing`} onClick={ doNothing } children='Do Nothing' />
      }
      { blowUp &&
        <button id={`${id}-blowUp`} onClick={ blowUp } children='Blow Up' />
      }
      { blowUp2 &&
        <button id={`${id}-blowUp2`} onClick={ blowUp2 } children='Blow Up 2' />
      }
      { blowUpDelayed &&
        <button id={`${id}-blowUpDelayed`} onClick={ blowUpDelayed } children='Blow Up Delayed' />
      }
      <button id={`${id}-initial`} onClick={ initial } children='Reset' />
      { load &&
        <button id='reload' onClick={ load } children='Reload' />
      }

      <input id={`${id}-changeTitle`} onChange={ changeTitle } />
      <button id={`${id}-uppercaseTitle`} onClick={ uppercaseTitle } children='uppercaseTitle' />
      <button id={`${id}-makeTitleHeading`} onClick={ makeTitleHeading } children='makeTitleHeading' />
    </div>
  )
}

const counterModel = {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: () => ({ count }) => ({ count: count + 1 }),
  decrement: () => ({ count }) => ({ count: count - 1 }),
  delayedIncrement: async () => {
    await waitMs(delayWait)
    return ({ count }) => ({ count: count + 1 })
  },
  delayedIncrementGenerator: function *() {
    yield waitMs(delayWait / 2)
    yield waitMs(delayWait / 2)
    yield ({ count }) => ({ count: count + 1 })
  },
  doNothing: () => {},
  blowUp: () => {
    throw new Error('Whoops')
  },
  blowUp2: () => (prevState) => {
    throw new Error('Whoops 2')
  },
  blowUpDelayed: async () => {
    await waitMs(delayWait)
    throw new Error('Whoops Delayed')
  }
}

const loadWait = 35
const delayWait = 20
const counterLoadModel = {
  initial: ({ initialCount = 0 }) => ({
    count: initialCount,
    title: 'Counter'
  }),
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
  decrement: () => ({ count }) => ({ count: count - 1 }),
  changeTitle: (props, { value }) => ({ title: value }),
  uppercaseTitle: () => ({ title }) => ({ title: title.toUpperCase() }),
  makeTitleHeading: () => ({ title: 'Heading' })
}

describe('makeMulticelledOrganism', () => {
  let node;
  const $ = (selector) => node.querySelector(selector)
  let promiseRender;

  beforeEach(() => {
    node = document.createElement('div')
    promiseRender = (element) => new Promise((resolve) => {
      render(element, node, resolve)
    })
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Sends click events', async () => {
    let changeCount = 0
    let latestState;

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
      onChange(state) {
        latestState = state
        changeCount++
      }
    })

    await promiseRender(<Organism initialCount={ 2 } />)
    const $aCurrentCount = $('#a-currentCount')
    const $bCurrentCount = $('#b-currentCount')
    expect($aCurrentCount.textContent).toBe('a: 2')
    expect($bCurrentCount.textContent).toBe('b: 2')

    // Click a increment
    ReactTestUtils.Simulate.click($('#a-increment'))
    expect($aCurrentCount.textContent).toBe('a: 3')
    expect($bCurrentCount.textContent).toBe('b: 2')

    // Click a decrement
    ReactTestUtils.Simulate.click($('#a-decrement'))
    expect($aCurrentCount.textContent).toBe('a: 2')
    expect($bCurrentCount.textContent).toBe('b: 2')

    // Click b decrement
    ReactTestUtils.Simulate.click($('#b-decrement'))
    expect($aCurrentCount.textContent).toBe('a: 2')
    expect($bCurrentCount.textContent).toBe('b: 1')
    expect(changeCount).toBe(3)

    // Click delayedIncrement
    ReactTestUtils.Simulate.click($('#a-delayedIncrement'))
    await waitMs(delayWait + 5)
    expect($aCurrentCount.textContent).toBe('a: 3')
    expect($bCurrentCount.textContent).toBe('b: 1')
    expect(changeCount).toBe(4)

    // Click delayedIncrementGenerator
    ReactTestUtils.Simulate.click($('#a-delayedIncrementGenerator'))
    await waitMs(delayWait / 2)
    await nextFrame()
    await waitMs(delayWait / 2)
    await nextFrame()
    await waitMs(5)
    expect($aCurrentCount.textContent).toBe('a: 4')
    expect($bCurrentCount.textContent).toBe('b: 1')
    expect(changeCount).toBe(5)

    ReactTestUtils.Simulate.click($('#b-doNothing'))
    expect($aCurrentCount.textContent).toBe('a: 4')
    expect($bCurrentCount.textContent).toBe('b: 1')
    expect(changeCount).toBe(5)

    // Click blowUp
    ReactTestUtils.Simulate.click($('#a-blowUp'))
    expect(latestState.handlerError).toExist()
    expect(latestState.handlerError.message).toBe('Whoops')

    // Click blowUp2
    ReactTestUtils.Simulate.click($('#b-blowUp2'))
    expect(latestState.handlerError).toExist()
    expect(latestState.handlerError.message).toBe('Whoops 2')

    // Click blowUpDelayed
    ReactTestUtils.Simulate.click($('#a-blowUpDelayed'))
    await waitMs(delayWait + 5)
    expect(latestState.handlerError).toExist()
    expect(latestState.handlerError.message).toBe('Whoops Delayed')
  })

  it('Calls load handler', async () => {
    let changeCount = 0
    let latestState;
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
      onChange(state) {
        latestState = state
        changeCount++
      }
    })

    await promiseRender(<Organism initialCount={ 2 } loadedCount={ 7 } />)
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

    await waitMs(loadWait + 5)
    // Loaded
    expect($aCurrentCount.textContent).toContain('14')
    expect(changeCount).toBe(4) // Both cells loaded, so change count increases by 2

    await promiseRender(<Organism initialCount={ 22 } loadedCount={ 7 } />)
    // Takes some time to load, so shouldn’t have changed yet
    expect($aCurrentCount.textContent).toContain('14')
    expect(changeCount).toBe(4)

    await promiseRender(<Organism initialCount={ 22 } loadedCount={ 9 } />)
    await waitMs(loadWait + 5)
    // Loaded from new props
    expect($aCurrentCount.textContent).toContain('18')
    expect(changeCount).toBe(6)

    expect($aTitle.textContent).toBe('Counter')

    ReactTestUtils.Simulate.click($('#a-uppercaseTitle'))
    expect($aTitle.textContent).toBe('COUNTER')

    ReactTestUtils.Simulate.click($('#a-makeTitleHeading'))
    expect($aTitle.textContent).toBe('Heading')

    // Click reload
    ReactTestUtils.Simulate.click($('#reload'))
    await waitMs(loadWait + 5)
    expect($aCurrentCount.textContent).toContain('18')
    expect(changeCount).toBe(10)

    // Load error
    await promiseRender(<Organism initialCount={ 22 } loadedCount='Not a number' />)
    await waitMs(loadWait + 5)
    expect(latestState.loadError).toExist()
    expect(changeCount).toBe(12)
  })

  it('getInitialProps()', async () => {
    let changeCount = 0
    let latestState;
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
      onChange(state) {
        latestState = state
        changeCount++
      }
    })

    const element = <Organism initialCount={ 2 } loadedCount={ 7 } />
    const instance = new Organism(element.props)

    const initialProps = await instance.getInitialProps(element.props)
    expect(initialProps).toEqual({
      counterA: { count: 14 },
      counterB: { count: 14 }
    })
  })

})
