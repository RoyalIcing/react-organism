import React, { PureComponent } from 'react'
import nextFrame from './nextFrame'

function stateChangerCatchingError(stateChanger, errorKey) {
  return (prevState, props) => {
    // Check if stateChanger is a function
    if (typeof(stateChanger) === typeof(stateChanger.call)) {
      try {
        // Call state changer
        return stateChanger(prevState, props)
      }
      // State changer may throw
      catch (error) {
        // Store error in state
        return { [errorKey]: error }
      }
    }
    // Else just an object with changes
    else {
      return stateChanger
    }
  }
}

// Returns a new stateful component, given the specified state handlers and a pure component to render with
export default (
  Pure,
  handlersIn,
  {
    onChange,
    adjustArgs
  } = {}
) => class Organism extends PureComponent {
  state = Object.assign(
    {
      loadError: null,
      handlerError: null
    },
    handlersIn.initial(this.props)
  )

  changeState(stateChanger) {
    // Can either be a plain object or a callback to transform the existing state
    this.setState(
      stateChanger,
      // Call onChange once updated with current version of state
      onChange ? () => { onChange(this.state) } : undefined
    )
  }

  // Uses `load` handler, if present, to asynchronously load initial state
  loadAsync(nextProps, prevProps) {
    if (handlersIn.load) {
      this.callHandler(
        handlersIn.load,
        'loadError',
        [ nextProps, prevProps ]
      )
    }
  }

  componentDidMount() {
    this.loadAsync(this.props, null)
  }

  componentWillReceiveProps(nextProps) {
    this.loadAsync(nextProps, this.props)
  }

  processStateChanger(stateChanger, errorID) {
    if (!stateChanger) {
      return;
    }

    // Check if thenable (i.e. a Promise)
    if (typeof stateChanger.then === typeof Object.assign) {
      return stateChanger.then(stateChanger => (
        //this.processStateChanger(stateChanger, errorID)
        stateChanger && this.changeState(stateChangerCatchingError(stateChanger, errorID))
      ))
      .catch(error => {
        this.changeState({ [errorID]: error })
      })
    }
    // Check if iterator
    else if (typeof stateChanger.next === typeof Object.assign) {
      return this.processIterator(stateChanger, errorID)
    }
    // Otherwise, change state immediately
    // Required for things like <textarea> onChange to keep cursor in correct position
    else {
      this.changeState(stateChangerCatchingError(stateChanger, errorID))
    }
  }

  processIterator(iterator, errorID, previousValue) {
    Promise.resolve(this.processStateChanger(previousValue, errorID)) // Process the previous changer
    .then(() => nextFrame()) // Wait for next frame
    .then(() => {
      const result = iterator.next() // Get the next step from the iterator
      if (result.done) { // No more iterations remaining
        return this.processStateChanger(result.value, errorID) // Process the changer
      }
      else {
        return this.processIterator(iterator, errorID, result.value) // Process the iterator’s following steps
      }
    })
  }

  callHandler(handler, errorID, args) {
    // Call handler function, props first, then rest of args
    try {
      const result = handler.apply(null, args);
      // Can return multiple state changers, ensure array, and then loop through
      [].concat(result).forEach(stateChanger => {
        this.processStateChanger(stateChanger, errorID)
      })
    }
    // Catch error within handler’s (first) function
    catch (error) {
      this.changeState({ [errorID]: error })
    }
  }

  handlers = Object.keys(handlersIn).reduce((out, key) => {
    // Special case for `load` handler to reload fresh
    if (key === 'load') {
      out.load = () => {
        this.loadAsync(this.props, null)
      }
      return out
    }

    out[key] = (...args) => {
      if (adjustArgs) {
        args = adjustArgs(args)
      }

      this.callHandler(
        handlersIn[key],
        'handlerError',
        [ Object.assign({}, this.props, { handlers: this.handlers }) ].concat(args)
      )
    }
    return out
  }, {})

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.handlers } />
  }
}
