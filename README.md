# React Organism

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

**Dead simple React state management to bring pure components alive**

- Embraces the existing functional `setState`, but avoids boilerplate
- Supports `async` and `await` and easy loading (e.g. `fetch()`)
- Simply export your handlers — no writing `this.setState` or `.bind` again
- Easy to write units test for (example coming soon)
- Dedicated [create-react-organism](https://www.npmjs.com/package/create-react-organism) tool to quickly create organisms: `yarn create react-organism OrganismName`

## Installation

```
npm i react-organism --save
```

## Demos

- [Inputs, forms, animation, fetch](https://react-organism.now.sh) · [code](https://github.com/BurntCaramel/react-organism/tree/master/demo/src)
- [Todo List](https://codesandbox.io/s/yME5Y3Yz)
- [User Stories Maker](https://codesandbox.io/s/xkZ5ZONl)
- [React Cheat Sheet](https://react-cheat.now.sh/) · [code](https://github.com/BurntCaramel/react-cheat)

## Usage

- [Basic](#basic)
- [Using props](#using-props)
- [Async & promises](#async)
- [Handling events](#handling-events)
- [Animation](#animation)
- [Serialization: Local storage](#serialization-local-storage)
- [Separate and reuse state handlers](#separate-and-reuse-state-handlers)
- [Multicelled organisms](#multicelled-organisms)

### Basic

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

### Using props

The handlers can easily use props, which are always passed as the first argument

```js
// organisms/Counter.js
import makeOrganism from 'react-organism'
import Counter from './components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
})
```

### Async

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

### Handling events

Handlers can easily accept arguments such as events.

```js
// components/Calculator.js
import React, { Component } from 'react'

export default function Calculator({
  value,
  handlers: {
    changeValue,
    double,
    add3,
    initial
  }
}) {
  return (
    <div>
      <input value={ value } onChange={ changeValue } />
      <button onClick={ double } children='Double' />
      <button onClick={ add3 } children='Add 3' />
      <button onClick={ initial } children='reset' />
    </div>
  )
}
```

```js
// organisms/Calculator.js
import makeOrganism from 'react-organism'
import Calculator from '../components/Calculator'

export default makeOrganism(Calculator, {
  initial: ({ initialValue = 0 }) => ({ value: initialValue }),
  // Destructure event to get target
  changeValue: (props, { target }) => ({ value }) => ({ value: parseInt(target.value, 10) }),
  double: () => ({ value }) => ({ value: value * 2 }),
  add3: () => ({ value }) => ({ value: value + 3 })
})
```

### Animation

```js
import makeOrganism from 'react-organism'
import nextFrame from 'react-organism/lib/nextFrame'
import Counter from '../components/Counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  offsetBy: (props, change) => ({ count }) => ({ count: count + change }),
  increment: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await nextFrame()
      await handlers.offsetBy(1)
      stride -= 1
    }
  },
  decrement: async ({ stride = 20, handlers }) => {
    while (stride > 0) {
      await waitNextFrame()
      await handlers.offsetBy(-1)
      stride -= 1
    }
  }
})
```

### Automatically extract from `data-` attributes and `<forms>`

Example coming soon

### Serialization: Local storage

```js
// organisms/Counter.js
import makeOrganism from 'react-organism'
import Counter from '../components/Counter'

const localStorageKey = 'counter'

export default makeOrganism(Counter, {
  initial: ({ initialCount = 0 }) => ({ count: initialCount }),
  load: async (props, prevProps) => {
    if (!prevProps) {
      // Try commenting out:
      /* throw (new Error('Oops!')) */

      // Load previously stored state, if present
      return await JSON.parse(localStorage.getItem(localStorageKey))
    }
  },
  increment: ({ stride = 1 }) => ({ count }) => ({ count: count + stride }),
  decrement: ({ stride = 1 }) => ({ count }) => ({ count: count - stride })
}, {
  onChange(state) {
    // When state changes, save in local storage
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
})
```

### Separate and reuse state handlers

React Organism supports separating state handlers and the component into their own files. This means state handlers could be reused by multiple smart components.

Here’s an example of separating state:

```js
// state/counter.js
export const initial = () => ({
  count: 0
})

export const increment = () => ({ count }) => ({ count: count + 1 })
export const decrement = () => ({ count }) => ({ count: count - 1 })
```

```js
// organisms/Counter.js
import makeOrganism from 'react-organism'
import Counter from './components/Counter'
import * as counterState from './state/counter'

export default makeOrganism(Counter, counterState)
```

```js
// App.js
import CounterOrganism from './organisms/Counter'

// ...
  return (
    <CounterOrganism />
  )
}
```

### Multicelled Organisms

Example coming soon.


## Why not Redux?

- Like Redux, separate your state management from rendering
- Unlike Redux, avoid loose strings for identifying actions
- Easier to reuse functionality, as action handlers are totally encapsulated
- No ability to reach across to the other side of your state tree
- Encourages composition of components
- Supports `async` and `await` in any action
- No `switch` statements


[build-badge]: https://img.shields.io/travis/RoyalIcing/react-organism/master.png?style=flat-square
[build]: https://travis-ci.org/RoyalIcing/react-organism

[npm-badge]: https://img.shields.io/npm/v/react-organism.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-organism

[coveralls-badge]: https://img.shields.io/coveralls/RoyalIcing/react-organism/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/RoyalIcing/react-organism
