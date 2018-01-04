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
  static initialStateForProps(props) {
    return handlersIn.initial(props)
  }

  get currentState() {
    return this.props.getState ? this.props.getState() : this.state
  }

  alterState = (stateChanger) => {
    // Can either be a plain object or a callback to transform the existing state
    (this.props.setState || this.setState).call(
      this,
      stateChanger,
      // Call onChange once updated with current version of state
      onChange ? () => { onChange(this.currentState) } : undefined
    )
  }

  awareness = makeAwareness(this.alterState, handlersIn, {
    getProps: () => this.props,
    adjustArgs
  })

  state = this.awareness.state

  componentDidMount() {
    this.awareness.loadAsync(this.props, null, this.currentState)
  }

  componentWillReceiveProps(nextProps) {
    this.awareness.loadAsync(nextProps, this.props, this.currentState)
  }

  render() {
    // Render the pure component, passing both props and state, plus handlers bundled together
    return <Pure { ...this.props } { ...this.currentState } handlers={ this.awareness.handlers } />
  }
}
