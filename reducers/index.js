import { RECEIVE_ENTRIES, ADD_ENTRY } from '../actions'

const entries = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_ENTRIES:
			return {
				...state,
				...action.entries,
				// Merge new entries with our existing state
				// https://davidwalsh.name/merge-objects
			}
		case ADD_ENTRY:
			return {
				...state,
				...action.entry,
			}
		default:
			return state
	}
}

export default entries
