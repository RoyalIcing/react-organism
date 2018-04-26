declare module 'react-organism' {
  import React from 'react'

  export interface ReceiverProps<HandlersOut> {
    handlers: HandlersOut
  }

  function makeOrganism<Props, State, HandlersIn, HandlersOut>(
    Pure:
      | React.ComponentClass<State & ReceiverProps<HandlersOut>>
      | React.StatelessComponent<State & ReceiverProps<HandlersOut>>,
    handlersIn: HandlersIn,
    options?: {
      onChange: (newState: State) => {}
      adjustArgs: (args: any[]) => any[]
    }
  ): React.ComponentClass<Props>

  export default makeOrganism
}
