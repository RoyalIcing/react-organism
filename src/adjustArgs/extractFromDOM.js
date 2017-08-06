const numberRegex = /_number$/

export default function extractFromDOM(args) {
  const targetProperty = 'currentTarget'
  // If being passed an event with DOM element that has a dataset
  if (args[0] && args[0][targetProperty] && args[0][targetProperty].dataset) {
    const event = args[0]
    const element = event[targetProperty]
    let values = {
      value: element.value,
      checked: element.checked,
      name: element.name
    }

    const { dataset } = element
    const dataKeys = Object.keys(dataset)

    // Read values from data- attributes
    dataKeys.forEach(dataKey => {
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
    })

    // If submitting a form and data-extract is present on the <form>
    if (event.type === 'submit' && dataset.extract) {
      event.preventDefault()

      const { elements } = element
      // Loop through form elements https://stackoverflow.com/a/19978872
      for (let i = 0, element; element = elements[i++];) {
          // Read value from <input>
          let value = element.value
          // Handle <input type='number'>
          if (element.type != null && element.type.toLowerCase() === 'number') {
            value = parseFloat(value)
          }
          values[element.name] = value
      }

      const reset = !!dataset.reset // data-reset
      if (reset && element.reset) {
        element.reset()
      }
    }

    // Place extracted dataset values first, followed by original arguments
    args = [values].concat(args)
  }

  return args
}