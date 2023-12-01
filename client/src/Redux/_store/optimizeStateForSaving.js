import pick from 'lodash/pick';
import { initialState as initialState_list } from '../list/list.reducer';
import { initialState as initialState_facet } from '../facet/facet.reducer';
import { initialState as initialState_live } from '../liveView/liveView.reducer';
import { initialState as initialState_auth } from '../auth/auth.reducer';

/**
 * returns optimized state for saving to local storage, used as initialState after browser refresh
 *
 * @param {object} state
 * @returns {{}}
 */
export function optimizeStateForSaving(state = {}) {
  const list = {
    ...initialState_list,
    ...pick(state.list, ['sortUp', 'markedRows', 'markedOnly', 'columnWidths']),
  };

  const facet = {
    ...initialState_facet,
    ...pick(state.facet, ['filter', 'negatedTypes']),
  };

  const liveView = {
    ...initialState_live,
    ...pick(state.liveView, ['updateFrequency', 'unit']),
  };

  const auth = {
    ...initialState_auth,
    ...pick(state.auth, ['token']),
  };

  return {
    list,
    facet,
    liveView,
    fields: { ...state.fields },
    searchText: state.searchText,
    auth,
  };
}
