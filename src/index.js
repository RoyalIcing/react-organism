import React, { PureComponent } from 'react'

// Returns a new stateful component, given the specified state handlers and a pure component to render with
export default (Pure, handlersIn, { onChange } = {}) => class Organism extends PureComponent {
  state = handlersIn.initial(this.props)

  // Uses `load` handler, if present, to asynchronously load initial state
  loadAsync(prevProps) {
    if (handlersIn.load) {
      Promise.resolve(handlersIn.load(this.props, prevProps))
        .then(updater => updater && this.setState(updater))
    }
  }

  componentDidMount() {
    this.loadAsync(null)
  }

  componentDidUpdate(prevProps) {
    this.loadAsync(prevProps)
  }

  handlers = Object.keys(handlersIn).reduce((out, key) => {
    if (key === 'load') {
      return out
    }

    if (key === 'reload' && handlersIn[key] === true) {
      out.reload = () => {
        this.loadAsync(null)
      }
      return out
    }

    out[key] = (...args) => {
      // Call handler, binding this-context and passing arguments along
      const stateChanger = handlersIn[key].apply(this, args)
      // Handlers can optionally change the state
      if (stateChanger) {
        // Can either be a plain object or a callback to transform the existing state
        this.setState(
          stateChanger,
          // Call onChange once state has updated with current version of state
          onChange ? () => { onChange(this.state) } : undefined
        )
      }
    }
    return out
  }, {})

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.handlers } />
  }
}
