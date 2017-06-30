import React from 'react'

const numberRegex = /_number$/

export default function makeMultiOrganism(Parent, cells, { onChange } = {}) {
  return class OrganismMultiCelled extends React.Component {
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
          // If being passed an event with DOM element that has a dataset
          if (args[0] && args[0].target && args[0].target.dataset) {
            const event = args[0]
            const { dataset } = event.target
            const dataKeys = Object.keys(dataset)
            // Extract values from dataset
            if (dataKeys.length > 0) {
              // If submitting a form and data-extract is present on the <form>
              if (event.type === 'submit' && dataset.extract) {
                event.preventDefault()

                const reset = !!dataset.reset // data-reset
                const { elements } = event.target
                let values = {}
                // Loop through form elements https://stackoverflow.com/a/19978872
                for (let i = 0, element; element = elements[i++];) {
                    // Read value from <input>
                    values[element.name] = element.value
                    if (reset) {
                      // Reset <input> value
                      element.value = ''
                    }
                }
                
                // Change arguments to extracted dataset values
                args = [values]
              }
              else {
                const values = dataKeys.reduce((values, dataKey) => {
                  let value
                  if (numberRegex.test(dataKey)) {
                    // Read and convert value
                    value = parseFloat(dataset[dataKey])
                    // Strip off _number suffix from final key
                    dataKey = dataKey.replace(numberRegex, '')
                  }
                  else {
                    // Use string value
                    value = dataset[dataKey]
                  }
                  
                  values[dataKey] = value
                  return values
                }, {})
                // Change arguments to extracted dataset values
                args = [values]
              }
            }
          }
          const stateChanger = Promise.resolve(
            // Call handler function
            handlersIn[key].apply(this, [ Object.assign({}, this.props, { handlers }) ].concat(args))
          )
          .then(stateChanger => {
            // Handlers can optionally change the state
            if (stateChanger) {
              // Can either be a plain object or a callback to transform the existing state
              this.setState(
                (prevState, props) => {
                  if (typeof(stateChanger) === typeof(stateChanger.call)) { // TODO: better function check?
                    prevState[cellKey] = stateChanger(prevState[cellKey], props)
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
      return <Parent { ...this.props } cells={ this.cellsProxy } />
    }
  }
}
