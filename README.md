# React Organism

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Dead simple React state management to bring pure components alive

- Embraces the existing mechanism of `setState`, but avoids boilerplate
- Lets you separate state management from rendering
- Simply export your handlers — no writing `this.setState` or `.bind` again and again
- Avoids loose strings for identifying actions
- Easy to write units test for

## Example — [Demo code](https://github.com/BurntCaramel/react-organism/tree/master/demo/src)

```js
// state/counter.js
export const initial = () => ({
  count: 0
})

export const increment = () => ({ count }) => ({ count: count + 1 })
export const decrement = () => ({ count }) => ({ count: count - 1 })
```

```js
// components/Counter.js
import React, { Component } from 'react'

export default function Counter({
  count,
  handlers: {
    increment,
    decrement
  }
}) {
  return (
    <div>
      <button onClick={ decrement } children='−' />
      <span>{ count }</span>
      <button onClick={ increment } children='+' />
    </div>
  )
}
```

```js
// index.js
import React, { Component } from 'react'
import { render } from 'react-dom'
import makeOrganism from 'react-organism'

import * as counterState from './state/counter'
import Counter from './components/Counter'

const CounterOrganism = makeOrganism(counterState, Counter)

function Example() {
  return (
    <div>
      <h1>React Organism Example</h1>
      <CounterOrganism />
    </div>
  )
}

render(<Demo/>, document.querySelector('#demo'))

```

Alternatively, you can write handlers inline:

```js
// organisms/Counter.js
import makeOrganism from 'react-organism'
import Counter from './components/Counter'

export default makeOrganism(Counter, {
  initial: () => ({ count: 0 }),
  increment: () => ({ count }) => ({ count: count + 1 }),
  decrement: () => ({ count }) => ({ count: count - 1 })
})
```

## Async

Asynchronous code to load from an API is easy:

```js
// components/Items.js
import React, { Component } from 'react'

export default function Counter({
  items,
  collectionName,
  handlers: {
    load
  }
}) {
  return (
    <div>
      {
        !!items ? (
          `${items.length} ${collectionName}`
        ) : (
          'Loading…'
        )
      }
      <div>
        <button onClick={ load } children='Reload' />
      </div>
    </div>
  )
}
```

```js
// organisms/Items.js
import makeOrganism from 'react-organism'
import Items from '../components/Items'

const baseURL = 'https://jsonplaceholder.typicode.com'
const fetchAPI = (path) => fetch(baseURL + path).then(r => r.json())

export default makeOrganism(Items, {
  initial: () => ({ items: null }),

  load: async ({ path }, prevProps) => {
    if (!prevProps || path !== prevProps.path) {
      return { items: await fetchAPI(path) }
    }
  }
})
```

```js
<div>
  <ItemsOrganism path='/photos' collectionName='photos' />
  <ItemsOrganism path='/todos' collectionName='todo items' />
</div>
```

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
