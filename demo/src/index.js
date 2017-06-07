import React, { Component } from 'react'
import { render } from 'react-dom'

import CounterOrganism from './organisms/Counter'
import Counter2Organism from './organisms/Counter2'
import Counter3Organism from './organisms/Counter3'
import ItemsOrganism from './organisms/Items'
import ItemsChoiceOrganism from './organisms/ItemsChoice'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-organism Demo</h1>
      <CounterOrganism />
      <hr />
      Using props: <Counter2Organism initialCount={ 9 } stride={ 3 } />
      <hr />
      Local storage: <Counter3Organism />
      <hr />
      <ItemsOrganism path='/posts' collectionName='posts' />
      <hr />
      <ItemsOrganism path='/photos' collectionName='photos' />
      <hr />
      <ItemsOrganism path='/todos' collectionName='todos' />
      <hr />
      <ItemsChoiceOrganism />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
