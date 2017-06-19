import React from 'react'

export default function makeMultiOrganism(Parent, cells, { onChange } = {}) {
  return class Smart extends React.Component {
    state = Object.keys(cells).reduce((state, cellKey) => {
      state[cellKey] = cells[cellKey].initial(this.props)
      return state
    }, {})

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
          // Call handler, binding this-context and passing props and arguments (e.g. event) along
          // Note: that this should only be given its own handlers, as that’s all it knows about
          const stateChanger = Promise.resolve(
            handlersIn[key].apply(this, [ Object.assign({}, this.props, { handlers }) ].concat(args))
          )
          .then(stateChanger => {
            // Handlers can optionally change the state
            if (stateChanger) {
              // Can either be a plain object or a callback to transform the existing state
              this.setState(
                (prevState) => {
                  if (typeof(stateChanger) === typeof(stateChanger.call)) { // FIXME for function check?
                    prevState[cellKey] = stateChanger(prevState[cellKey])
                  }
                  else {
                    prevState[cellKey] = stateChanger
                  }
                  return prevState
                },
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
      return <Parent props={ this.props } cells={ this.cellsProxy } />
    }
  }
}
