import React, { Component } from 'react'
import { render } from 'react-dom'

import makeOrganism from '../../src'
import * as counterState from './state/counter'
import Counter from './components/Counter'

const CounterOrganism = makeOrganism(counterState, Counter)

class Demo extends Component {
  render() {
    return <div>
      <h1>react-organism Demo</h1>
      <CounterOrganism />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
