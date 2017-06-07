import React, { Component } from 'react'
import { render } from 'react-dom'

// import makeOrganism from '../../src'
// import * as counterState from './state/counter'
// import Counter from './components/Counter'

// const CounterOrganism = makeOrganism(counterState, Counter)

import CounterOrganism from './organisms/Counter'
import ItemsOrganism from './organisms/Items'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-organism Demo</h1>
      <CounterOrganism />
      <ItemsOrganism path='/posts' collectionName='posts' />
      <ItemsOrganism path='/photos' collectionName='photos' />
      <ItemsOrganism path='/todos' collectionName='todos' />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
