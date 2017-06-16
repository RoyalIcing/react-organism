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
      <h1><a href="https://github.com/RoyalIcing/react-organism">react-organism</a></h1>
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
      <h3>Handling prop changes:</h3>
      <ItemsChoiceOrganism />
      <hr />
      <h3>Event handlers with calculator:</h3>
      <CalculatorOrganism />

      <style>{`
* {
  padding: 0;
  font-size: inherit;
  box-sizing: border-box;
}

html {
  font-size: 18px;
  font-family: system, "-apple-system", "-webkit-system-font", BlinkMacSystemFont, "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Arial", "freesans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.3;
}

a {
  color: inherit;
}

h1 {
  font-size: 1.5rem;
}

button, input {
  padding: 0.2em 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.25em;
}
button {
  color: #222;
  background: #eee;
}

hr {
  border: none;
  border-top: 1px solid #ccc;
}

.h-spaced > * {
  margin-right: 0.5em;
}
`}</style>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
