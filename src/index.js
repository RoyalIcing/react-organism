import React, { PureComponent } from 'react'
import makeAwareness from 'awareness'

// Returns a new stateful component, given the specified state handlers and a pure component to render with
export default (
  Pure,
  handlersIn,
  {
    onChange,
    adjustArgs
  } = {}
) => class Organism extends PureComponent {
  awareness = makeAwareness(this.alterState, handlersIn, {
    getProps: () => this.props,
    adjustArgs
  })

  state = this.awareness.state

  alterState = (stateChanger) => {
    // Can either be a plain object or a callback to transform the existing state
    this.setState(
      stateChanger,
      // Call onChange once updated with current version of state
      onChange ? () => { onChange(this.state) } : undefined
    )
  }

  componentDidMount() {
    this.awareness.loadAsync(this.props, null)
  }

  componentWillReceiveProps(nextProps) {
    this.awareness.loadAsync(nextProps, this.props)
  }

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.state } handlers={ this.awareness.handlers } />
  }
}
