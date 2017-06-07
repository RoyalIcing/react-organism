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
// organisms/Counter.js
import makeOrganism from 'react-organism'
import Counter from './components/Counter'
import * as counterState from './state/counter'

export default makeOrganism(Counter, counterState)
```

```js
import CounterOrganism from './organisms/Counter'

// ...
  return (
    <CounterOrganism />
  )
}
```

### Inline

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

### Use props

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


[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
