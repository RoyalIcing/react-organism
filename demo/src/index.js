import React, { Component } from 'react'
import { render } from 'react-dom'

import CounterOrganism from './organisms/Counter'
import Counter2Organism from './organisms/Counter2'
import Counter3Organism from './organisms/Counter3'
import Counter4Organism from './organisms/Counter4'
import ItemsOrganism from './organisms/Items'
import ItemsChoiceOrganism from './organisms/ItemsChoice'
import CalculatorOrganism from './organisms/Calculator'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-organism</h1>
      <h3>Simple counter:</h3>
      <CounterOrganism />
      <hr />
      <h3>Using props to customize:</h3>
      <Counter2Organism initialCount={ 9 } stride={ 3 } />
      <hr />
      <h3>Local storage (change and reload page):</h3>
      <Counter3Organism />
      <hr />
      <h3>Async animated:</h3>
      <Counter4Organism />
      <hr />
      <h3>Load data from API:</h3>
      <ItemsOrganism path='/posts' collectionName='posts' />
      <hr />
      <ItemsOrganism path='/photos' collectionName='photos' />
      <hr />
      <ItemsOrganism path='/todos' collectionName='todos' />
      <hr />
      <ItemsChoiceOrganism />
      <hr />
      <CalculatorOrganism />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
