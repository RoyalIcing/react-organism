import makeOrganism from '../../../src'
import * as loadItemsState from '../state/placeholderAPI'
import Items from '../components/Items'

export default makeOrganism(loadItemsState, Items)
