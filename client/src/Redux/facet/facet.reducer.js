import {
  ADD_FACET_DATA,
  ADD_TO_TOTAL_FOUND,
  MERGE_FILTER_FACET_DATA,
  MERGE_NEGATED_FILTER_TYPE,
  MERGE_SELECTED_FACET_DATA,
  SET_FACET_DATA,
  SET_FACET_START_LIMIT,
  SET_FILTER_FACET_DATA,
  SET_FILTER_TEXT,
  SET_NEGATED_FILTER_TYPE,
  SET_SELECTED_FACET_DATA,
  SET_TOTAL_FOUND,
} from './facet.actionTypes';

export const initialState = {
  data: [],
  selected: {},
  filter: {},
  negatedTypes: {},
  filterText: '',
  totalFound: 0,
  facetStartLimit: 10,
};

export const facetDataReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FACET_DATA:
      return { ...state, data: [...payload] };
    case ADD_FACET_DATA:
      return { ...state, data: addFacetDataHelper(state.data, payload) };
    case SET_SELECTED_FACET_DATA:
      return { ...state, selected: { ...payload } };
    case MERGE_SELECTED_FACET_DATA:
      return { ...state, selected: { ...state.selected, ...payload } };
    case SET_FILTER_FACET_DATA:
      return { ...state, filter: { ...payload } };
    case MERGE_FILTER_FACET_DATA:
      var newNegated;
      if (Object.keys(payload).length !== 0) {
        const key = Object.keys(payload)[0].split(':')[0];
        newNegated = { ...state.negatedTypes, [key]: false };
      } else {
        newNegated = state.negatedTypes;
      }

      return {
        ...state,
        filter: { ...state.filter, ...payload },
        negatedTypes: newNegated,
      };
    case SET_NEGATED_FILTER_TYPE:
      return { ...state, negatedTypes: { ...payload } };
    case MERGE_NEGATED_FILTER_TYPE:
      return { ...state, negatedTypes: { ...state.negatedTypes, ...payload } };
    case SET_FILTER_TEXT:
      return { ...state, filterText: payload };
    case SET_FACET_START_LIMIT:
      return { ...state, facetStartLimit: payload };
    case SET_TOTAL_FOUND:
      return { ...state, totalFound: payload };
    case ADD_TO_TOTAL_FOUND:
      return { ...state, totalFound: Number(state.totalFound) + payload };
    default:
      return state;
  }
};

function addFacetDataHelper(state = [], newFacetData = []) {
  let result = [...state];

  newFacetData.forEach((newFacet) => {
    let included = false;
    result = result.map((oldFacet) => {
      if (oldFacet.id === newFacet.id) {
        included = true;
        return {
          ...oldFacet,
          count: oldFacet.count + newFacet.count,
        };
      }
      return oldFacet;
    });
    if (!included) {
      result.push(newFacet);
    }
  });
  return result;
}
