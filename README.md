# React Organism

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

**Dead simple React state management to bring pure components alive**

- Embraces the existing functional `setState`, but avoids boilerplate (no writing `this.setState()` or `.bind` again)
- Supports `async` and `await` and easy loading (e.g. `fetch()`)
- Tiny: [1.42KB gzipped (3.59KB uncompressed)](http://closure-compiler.appspot.com/home#code%3D%252F%252F%2520%253D%253DClosureCompiler%253D%253D%250A%252F%252F%2520%2540output_file_name%2520default.js%250A%252F%252F%2520%2540compilation_level%2520SIMPLE_OPTIMIZATIONS%250A%252F%252F%2520%2540code_url%2520https%253A%252F%252Funpkg.com%252Freact-organism%250A%252F%252F%2520%253D%253D%252FClosureCompiler%253D%253D%250A%250A'use%2520strict'%253B%250A)
- Easy to write units test for (example coming soon)
- Dedicated [create-react-organism](https://www.npmjs.com/package/create-react-organism) tool to quickly create organisms: `yarn create react-organism OrganismName`

#### Table of contents

- [Installation](#installation)
- [Demos](#demos)
- [Usage](#usage)
  - [Basic](#basic)
  - [Using props](#using-props)
  - [Async & promises](#async)
  - [Handling events](#handling-events)
  - [Animation](#animation)
  - [Serialization: Local storage](#serialization-local-storage)
  - [Separate and reuse state handlers](#separate-and-reuse-state-handlers)
  - [Multicelled organisms](#multicelled-organisms)
- [API](#api)
  - [`makeOrganism(PureComponent, StateFunctions, options)`](#makeorganismpurecomponent-statefunctions-options)
  - [State functions](#state-functions)
  - [Argument enhancers](#argument-enhancers)
- [Why not Redux?](#why-not-redux)

## Installation

```
npm i react-organism --save
```

## Demos

- [Animated counter](https://codesandbox.io/s/mZK9Prnv9)
- [Dynamic loading with `import()`](https://codesandbox.io/s/X6mLEwG7W)
- [Live form error validation with Yup](https://codesandbox.io/s/4xQpKRRWx)
- [Multicelled component — using multiple states](https://codesandbox.io/s/Yv7j1xLqM)
- [Todo List](https://codesandbox.io/s/yME5Y3Yz)
- [Inputs, forms, animation, fetch](https://react-organism.now.sh) · [code](https://github.com/BurntCaramel/react-organism/tree/master/demo/src)
- [User Stories Maker](https://codesandbox.io/s/xkZ5ZONl)
- [React Cheat Sheet](https://react-cheat.now.sh/) · [code](https://github.com/BurntCaramel/react-cheat)

## Usage

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


## API

### `makeOrganism(PureComponent, StateFunctions, options?)`
```js
import makeOrganism from 'react-organism'
```
Creates a smart component, rendering using React component `PureComponent`, and managing state using `StateFunctions`.

#### `PureComponent`
A React component, usually a pure functional component. This component is passed as its props:

- The props passed to the smart component, combined with
- The current state, combined with
- `handlers` which correspond to each function in `StateFunctions` and are ready to be passed to e.g. `onClick`, `onChange`, etc.
- `loadError?`: Error produced by the `load` handler
- `handlerError?`: Error produced by any other handler

#### `StateFunctions`
Object with functional handlers. See [state functions below](#state-functions).

Either pass a object directly with each function, or create a separate file with each handler function `export`ed out, and then bring in using `import * as StateFunctions from '...'`.

#### `options`

##### `adjustArgs?(args: array) => newArgs: array`

Used to enhance handlers. See [built-in handlers below](#argument-enhancers).

##### `onChange?(state)`

Called after the state has changed, making it ideal for saving the state somewhere (e.g. Local Storage).


### State functions

Your state is handled by a collection of functions. Each function is pure: they can only rely on the props and state passed to them. Functions return the new state, either immediately or asynchronously.

Each handler is passed the current props first, followed by the called arguments:
- `(props, event)`: most event handlers, e.g. `onClick`, `onChange`
- `(props, first, second)`
- `(props, ...args)`: get all arguments passed
- `(props)`: ignore any arguments
- `()`: ignore props and arguments

Handlers must return one of the following:
- An object with new state changes, a la React’s `setState(changes)`.
- A function accepting the previous state and current props, and returns the new state, a la React’s `setState((prevState, props) => changes)`.
- A promise resolving to any of the above (object / function), which will then be used to update the state. Uncaught errors are stored in state under the key `handlerError`. Alternatively, your handler can use the `async`/`await` syntax.
- An array of any of the above (object / function / promise).
- Or optionally, nothing.

There are some handlers for special tasks, specifically:

#### `initial(props) => object` (required)
Return initial state to start off with, a la React’s `initialState`. Passed props.

#### `load(props: object, prevProps: object?, { handlers: object }) => object | Promise<object> | void` (optional)
Passed the current props and the previous props. Return new state, a Promise returning new state, or nothing.

If this is the first time loaded or if being reloaded, then `prevProps` is `null`.

Usual pattern is to check for either `prevProps` being `null` or if the prop of interest has changed from its previous value:
```js
export const load = async ({ id }, prevProps) => {
  if (!prevProps || id !== prevProps.id) {
    return { item: await loadItem(id) }
  }
}
```

Your `load` handler will be called in React’s lifecycle: `componentDidMount` and `componentWillReceiveProps`.


### Argument enhancers

Handler arguments can be adjusted, to cover many common cases. Pass them to the `adjustArgs` option. The following enhancers are built-in:

#### `extractFromDOM(args: array) => newArgs: array`
```js
import extractFromDOM from 'react-organism/lib/adjustArgs/extractFromDOM'
```

Extract values from DOM, specifically:
- For events as the first argument, extracts `value`, `checked`, and `name` from `event.target`. Additionally, if target has `data-` attributes, these will also be extracted in camelCase from its [`dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset). Suffixing `data-` attributes with `_number` will convert value to a number (instead of string) using `parseFloat`, and drop the suffix. Handler will receive these extracted values in an object as the first argument, followed by the original arguments.
- For `submit` events, extracts values of `<input>` fields in a `<form>`. Handler will receive the values keyed by the each input’s `name` attribute, followed by the original arguments. Pass the handler to the `onSubmit` prop of the `<form>`. Form must have `data-extract` attribute present. To clear the form after submit, add `data-reset` to the form.


## Why not Redux?

- Like Redux, separate your state management from rendering
- Unlike Redux, avoid loose strings for identifying actions
- Redux encourages having state in one bundle, whereas dynamic `import()` encourages breaking apps into sections
- Easier to reuse functionality, as action handlers are totally encapsulated
- No ability to reach across to the other side of your state tree
- Encourages composition of components
- Supports `async` and `await` in any action
- No `switch` statements
- No boilerplate or additional helper libraries


[build-badge]: https://img.shields.io/travis/RoyalIcing/react-organism/master.png?style=flat-square
[build]: https://travis-ci.org/RoyalIcing/react-organism

[npm-badge]: https://img.shields.io/npm/v/react-organism.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-organism

[coveralls-badge]: https://img.shields.io/coveralls/RoyalIcing/react-organism/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/RoyalIcing/react-organism
