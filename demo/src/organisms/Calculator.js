import makeOrganism from '../../../src'
import Calculator from '../components/Calculator'

export default makeOrganism(Calculator, {
  initial: ({ initialValue = 0 }) => ({ value: initialValue }),
  changeValue: (props, { target }) => ({ value: parseInt(target.value, 10) || '' }),
  // Or more robust number input handling with fallback to previous value:
  // changeValue: (props, { target: { value: newValue } }) => ({ value: previousValue }) => ({
  //   value: newValue && (parseInt(newValue, 10) || previousValue)
  // }),
  double: () => ({ value }) => ({ value: value * 2 }),
  add3: () => ({ value }) => ({ value: value + 3 })
})
