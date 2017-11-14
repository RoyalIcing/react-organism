import extractValuesFromDOMEvent from 'awareness/lib/extractValuesFromDOMEvent'

export default function extractFromDOM(args) {
  if (args[0]) {
    const values = extractValuesFromDOMEvent(args[0])

    // Place extracted dataset values first, followed by original arguments
    args = [values].concat(args)
  }

  return args
}