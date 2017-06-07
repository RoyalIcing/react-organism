import makeOrganism from '../../../src'
import Calculator from '../components/Calculator'

export default makeOrganism(Calculator, {
  initial: ({ initialValue = 0 }) => ({ value: initialValue }),
  changeValue: (props, { target }) => ({ value }) => ({ value: parseInt(target.value, 10) }),
  double: () => ({ value }) => ({ value: value * 2 }),
  add3: () => ({ value }) => ({ value: value + 3 })
})
