import React from 'react'
import makeAwareness from 'awareness'
import nextFrame from './nextFrame'

function cellStateChangerCatchingError(cellKey, stateChanger, errorKey) {
  return (prevState, props) => {
    let cellChanges = {}
    // Check if stateChanger is a function
    if (typeof(stateChanger) === typeof(stateChanger.call)) {
      try {
        // Call state changer
        cellChanges = stateChanger(prevState[cellKey], props)
      }
      // State changer may throw
      catch (error) {
        // Store error in state
        return { [errorKey]: error }
      }
    }
    // Else just an object with changes
    else {
      cellChanges = stateChanger
    }
    return {
      [cellKey]: Object.assign({}, prevState[cellKey], cellChanges)
    }
  }
}

function processStateChanger(changeState, stateChanger, storeError) {
  if (!stateChanger) {
    return;
  }

  // Check if thenable (i.e. a Promise)
  if (typeof stateChanger.then === typeof Object.assign) {
    return stateChanger.then(stateChanger => (
      stateChanger && changeState(stateChanger)
    ))
    .catch(storeError)
  }
  // Check if iterator
  else if (typeof stateChanger.next === typeof Object.assign) {
    return processIterator(changeState, stateChanger, storeError)
  }
  // Otherwise, change state immediately
  // Required for things like <textarea> onChange to keep cursor in correct position
  else {
    changeState(stateChanger)
  }
}

function processIterator(changeState, iterator, storeError, previousValue) {
  return Promise.resolve(processStateChanger(changeState, previousValue, storeError)) // Process the previous changer
  .then(() => nextFrame()) // Wait for next frame
  .then(() => {
    const result = iterator.next() // Get the next step from the iterator
    if (result.done) { // No more iterations remaining
      return processStateChanger(changeState, result.value, storeError) // Process the changer
    }
    else {
      return processIterator(changeState, iterator, storeError, result.value) // Process the iterator’s following steps
    }
  })
}

export default function makeMultiOrganism(
  Parent,
  cells,
  {
    onChange,
    adjustArgs
  } = {}
) {
  return class OrganismMulticelled extends React.Component {
    getProps = () => this.props

    cellsAwareness = Object.keys(cells).reduce((out, cellKey) => {
      const alterState = (stateChanger) => {
        // Can either be a plain object or a callback to transform the existing state
        this.setState(
          (prevState, props) => {
            const cellChanges = stateChanger(prevState[cellKey])
            if (cellChanges.loadError || cellChanges.handlerError) {
              return cellChanges
            }
            return {
              [cellKey]: Object.assign({}, prevState[cellKey], cellChanges)
            }
          },
          // Call onChange once updated with current version of state
          onChange ? () => { onChange(this.state) } : undefined
        )
      }

      out[cellKey] = makeAwareness(alterState, cells[cellKey], {
        getProps: this.getProps,
        adjustArgs
      })
      return out
    }, {})
    
    state = Object.keys(this.cellsAwareness).reduce((state, cellKey) => {
      // Grab each cell’s initial value
      state[cellKey] = this.cellsAwareness[cellKey].state
      return state
    }, {
      loadError: null,
      handlerError: null
    })

    changeState(stateChanger) {
      // Can either be a plain object or a callback to transform the existing state
      this.setState(
        stateChanger,
        // Call onChange once updated with current version of state
        onChange ? () => { onChange(this.state) } : undefined
      )
    }

    loadPromises(nextProps, prevProps) {
      return Object.keys(cells).map(cellKey => {
        const handlersIn = cells[cellKey]
        if (handlersIn.load) {
          // Wrap in Promise to safely catch any errors thrown by `load`
          return Promise.resolve(true)
            .then(() => handlersIn.load(nextProps, prevProps))
            .then(values => (!!values ? { values, cellKey } : undefined))
        }
      })
          .filter(Boolean) // Filter out cells without .load
    }

    // Uses `load` handler, if present, to asynchronously load initial state
    loadAsync(nextProps, prevProps) {
      this.loadPromises(nextProps, prevProps)
        .forEach(promise => {
          promise.then(result => {
            if (!result) {
              return
            }
            this.changeState(cellStateChangerCatchingError(result.cellKey, result.values, 'loadError'))
          })
          .catch(error => this.changeState({ loadError: error }))
        })
    }

    // Used by Next.js
    getInitialProps(props) {
      return Promise.all(this.loadPromises(props, null))
        .then(results => results.filter(Boolean)) // Filter out .load that returned nothing
        .then(results => (
          results.reduce((initialCellValues, { values, cellKey }) => {
            initialCellValues[cellKey] = values
            return initialCellValues
          }, {})
        ))
    }

    componentDidMount() {
      this.loadAsync(this.props, null)
    }

    componentWillReceiveProps(nextProps) {
      this.loadAsync(nextProps, this.props)
    }

    cellsProxy = Object.keys(cells).reduce((cellsProxy, cellKey) => {
      const { handlers } = this.cellsAwareness[cellKey]

      Object.defineProperty(cellsProxy, cellKey, {
        get: () => {
          // Track which cells are used
          //this.usedCells[cellKey] = true
          return Object.assign({}, this.state[cellKey], { handlers })
        }
      })
      return cellsProxy
    }, {})

    render() {
      // Render the pure component, passing both props and cells
      return <Parent { ...this.props } cells={ this.cellsProxy } />
    }
  }
}
