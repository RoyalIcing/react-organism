import React from 'react'
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

export default function makeMultiOrganism(
  Parent,
  cells,
  {
    onChange,
    adjustArgs
  } = {}
) {
  return class OrganismMulticelled extends React.Component {
    state = Object.keys(cells).reduce((state, cellKey) => {
      // Grab each cell’s initial value
      state[cellKey] = cells[cellKey].initial(this.props)
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

    processStateChanger(cellKey, stateChanger, errorID) {
      if (!stateChanger) {
        return;
      }
  
      // Check if thenable (i.e. a Promise)
      if (typeof stateChanger.then === typeof Object.assign) {
        return stateChanger.then(stateChanger => (
          //this.processStateChanger(stateChanger, errorID)
          stateChanger && this.changeState(cellStateChangerCatchingError(cellKey, stateChanger, errorID))
        ))
        .catch(error => {
          this.changeState({ [errorID]: error })
        })
      }
      // Check if iterator
      else if (typeof stateChanger.next === typeof Object.assign) {
        return this.processIterator(cellKey, stateChanger, errorID)
      }
      // Otherwise, change state immediately
      // Required for things like <textarea> onChange to keep cursor in correct position
      else {
        this.changeState(cellStateChangerCatchingError(cellKey, stateChanger, errorID))
      }
    }
  
    processIterator(cellKey, iterator, errorID, previousValue) {
      Promise.resolve(this.processStateChanger(cellKey, previousValue, errorID)) // Process the previous changer
      .then(() => nextFrame()) // Wait for next frame
      .then(() => {
        const result = iterator.next() // Get the next step from the iterator
        if (result.done) { // No more iterations remaining
          return this.processStateChanger(cellKey, result.value, errorID) // Process the changer
        }
        else {
          return this.processIterator(cellKey, iterator, errorID, result.value) // Process the iterator’s following steps
        }
      })
    }
  
    callHandler(cellKey, handler, errorID, args) {
      // Call handler function, props first, then rest of args
      try {
        const result = handler.apply(null, args);
        // Can return multiple state changers, ensure array, and then loop through
        [].concat(result).forEach(stateChanger => {
          this.processStateChanger(cellKey, stateChanger, errorID)
        })
      }
      // Catch error within handler’s (first) function
      catch (error) {
        this.changeState({ [errorID]: error })
      }
    }

    cellsProxy = Object.keys(cells).reduce((cellsProxy, cellKey) => {
      const handlersIn = cells[cellKey]
      const handlers = Object.keys(handlersIn).reduce((out, key) => {
        // Special case for `load` handler to reload fresh
        if (key === 'load') {
          out.load = () => {
            // FIXME
            this.loadAsync(this.props, null)
          }
          return out
        }

        out[key] = (...args) => {
          if (adjustArgs) {
            args = adjustArgs(args)
          }

          this.callHandler(
            cellKey,
            handlersIn[key],
            'handlerError',
            [ Object.assign({}, this.props, { handlers }) ].concat(args)
          )
        }
        return out
      }, {})

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
