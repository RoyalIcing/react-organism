import React, { PureComponent } from 'react'

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
      // Wrap in Promise to safely catch any errors thrown by `load`
      Promise.resolve(true).then(() => handlersIn.load(nextProps, prevProps))
        .then(updater => updater && this.changeState(stateChangerCatchingError(updater, 'handlerError')))
        .catch(error => this.changeState({ loadError: error }))
    }
  }

  componentDidMount() {
    this.loadAsync(this.props, null)
  }

  componentWillReceiveProps(nextProps) {
    this.loadAsync(nextProps, this.props)
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

      // Call handler function, props first, then rest of args
      try {
        const result = handlersIn[key].apply(null, [ Object.assign({}, this.props, { handlers: this.handlers }) ].concat(args));
        // Can return multiple state changers, ensure array, and then loop through
        [].concat(result).forEach(stateChanger => {
          // Can return no state changer
          if (!stateChanger) {
            return;
          }

          // Check if thenable (i.e. a Promise)
          if (typeof stateChanger.then === typeof Object.assign) {
            stateChanger.then(stateChanger => {
              // Handlers can optionally change the state
              stateChanger && this.changeState(stateChangerCatchingError(stateChanger, 'handlerError'))
            })
            .catch(error => {
              this.changeState({ handlerError: error })
            })
          }
          // Otherwise, change state immediately
          // Required for things like <textarea> onChange to keep cursor in correct position
          else {
            this.changeState(stateChangerCatchingError(stateChanger, 'handlerError'))
          }
        })
      }
      // Catch error within handler’s (first) function
      catch (error) {
        this.changeState({ handlerError: error })
      }
    }
    return out
  }, {})

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.handlers } />
  }
}
