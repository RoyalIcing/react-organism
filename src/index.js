import React, { PureComponent } from 'react'

// Returns a new stateful component, given the specified state handlers and a pure component to render with
export default (Pure, handlersIn, { onChange } = {}) => class Organism extends PureComponent {
  state = Object.assign(
    { loadError: null },
    handlersIn.initial(this.props)
  )

  // Uses `load` handler, if present, to asynchronously load initial state
  loadAsync(nextProps, prevProps) {
    if (handlersIn.load) {
      // Wrap in Promise to safely catch any errors thrown by `load`
      Promise.resolve(true).then(() => handlersIn.load(nextProps, prevProps))
      .then(updater => updater && this.setState(updater))
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
      // Call handler, binding this-context and passing props and arguments (e.g. event) along
      //const stateChanger = handlersIn[key].apply(this, [ this.props ].concat(args))
      const stateChanger = Promise.resolve(
        //handlersIn[key].apply(this, [ this.props ].concat(args))
        handlersIn[key].apply(this, [ Object.assign({}, this.props, { handlers: this.handlers }) ].concat(args))
      )
      .then(stateChanger => {
        // Handlers can optionally change the state
        if (stateChanger) {
          // Can either be a plain object or a callback to transform the existing state
          this.setState(
            stateChanger,
            // Call onChange once updated with current version of state
            onChange ? () => { onChange(this.state) } : undefined
          )
        }
      })
      .catch(error => {
        this.setState({ handlerError: error })
      })
    }
    return out
  }, {})

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.handlers } />
  }
}
