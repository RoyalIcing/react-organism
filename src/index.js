import React, { PureComponent } from 'react'

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
    { loadError: null },
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
      Promise.resolve(true).then(() => handlersIn.load(nextProps, prevProps, { handlers: this.handlers }))
        .then(updater => updater && this.changeState(updater))
        .catch(error => this.setState({ loadError: error }))
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
      const result = handlersIn[key].apply(null, [ Object.assign({}, this.props, { handlers: this.handlers }) ].concat(args));
      // Can return multiple state changers, ensure array, and then loop through
      [].concat(result).forEach(stateChanger => {
        // Check if thenable (i.e. a Promise)
        if (!!stateChanger && (typeof stateChanger.then === typeof Object.assign)) {
          stateChanger.then(stateChanger => {
            // Handlers can optionally change the state
            stateChanger && this.changeState(stateChanger)
          })
          .catch(error => {
            this.setState({ handlerError: error })
          })
        }
        // Otherwise, change state immediately
        // Required for things like <textarea> onChange to keep cursor in correct position
        else {
          stateChanger && this.changeState(stateChanger)
        }
      })
    }
    return out
  }, {})

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.handlers } />
  }
}
