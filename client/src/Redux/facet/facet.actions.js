import { requestEndAction, requestStartAction } from '../actions';
import { errorHandler } from '../../utils/errorHandler';
import { REQ_FACETS_PER_TYPE, REQ_FACETS_PER_TYPE_AND_SEARCH_STRING, REQ_FACETS_PER_SEARCH_TEXT_AND_FILTER } from '../../utils/requestTypes';
import { selectActiveNavigators } from '../selectors';
import { transformFacetDataToList } from './facet.helper';
import { selectFacetData } from './facet.selectors';
import { fetchFacetsByTypeAndSearchString, fetchFacetsForUpdatedSearchTextOrFilter, fetchOnlyFacetsForKey } from '../../API/facet.api';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';
import { promisifyXhr } from '../../utils/promisifyXhr';
import * as ActionTypes from './facet.actionTypes';

export const setFacetData = (facetData) => {
  return {
    type: ActionTypes.SET_FACET_DATA,
    payload: facetData,
  };
};

export const addFacetData = (facetData) => {
  return {
    type: ActionTypes.ADD_FACET_DATA,
    payload: facetData,
  };
};

export const setSelectedFacetData = (selection) => {
  return {
    type: ActionTypes.SET_SELECTED_FACET_DATA,
    payload: selection,
  };
};
export const mergeSelectedFacetData = (selection) => {
  return {
    type: ActionTypes.MERGE_SELECTED_FACET_DATA,
    payload: selection,
  };
};
export const setFacetFilter = (payload) => {
  return {
    type: ActionTypes.SET_FILTER_FACET_DATA,
    payload,
  };
};
export const mergeFacetFilter = (payload) => {
  return {
    type: ActionTypes.MERGE_FILTER_FACET_DATA,
    payload,
  };
};
export const setNegatedFilterType = (payload) => {
  return {
    type: ActionTypes.SET_NEGATED_FILTER_TYPE,
    payload,
  };
};
export const mergeNegatedFilterType = (payload) => {
  return {
    type: ActionTypes.MERGE_NEGATED_FILTER_TYPE,
    payload,
  };
};
export const setFilterText = (payload) => {
  return {
    type: ActionTypes.SET_FILTER_TEXT,
    payload,
  };
};
export const setTotalFound = (payload) => {
  return {
    type: ActionTypes.SET_TOTAL_FOUND,
    payload,
  };
};
export const addToTotalFound = (payload) => {
  return {
    type: ActionTypes.ADD_TO_TOTAL_FOUND,
    payload,
  };
};

export const setFacetStartLimit = (payload) => {
  return {
    type: ActionTypes.SET_FACET_START_LIMIT,
    payload,
  };
};

export const fetchAdditionalFacetsByType = (type) => {
  return async (dispatch, getState) => {
    const state = getState();
    const activeNavigators = selectActiveNavigators(state);
    const oldFacetData = selectFacetData(state);
    try {
      const xhr = fetchOnlyFacetsForKey(state, type);
      dispatch(requestStartAction(REQ_FACETS_PER_TYPE, xhr));
      const data = await promisifyXhr(xhr);

      const newFacetData = transformFacetDataToList(JSON.parse(data)['facets'], activeNavigators);
      const facetData = uniqBy([...oldFacetData, ...newFacetData], 'id');

      dispatch(setFacetData(facetData));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_FACETS_PER_TYPE));
  };
};

export const fetchFacetsWithSearchTextAndFilter = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const activeNavigators = selectActiveNavigators(state);

    try {
      const xhr = fetchFacetsForUpdatedSearchTextOrFilter(state);
      dispatch(requestStartAction(REQ_FACETS_PER_SEARCH_TEXT_AND_FILTER, xhr));
      const data = await promisifyXhr(xhr);
      const facetData = transformFacetDataToList(JSON.parse(data)['facets'], activeNavigators);

      dispatch(setFacetData(facetData));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_FACETS_PER_SEARCH_TEXT_AND_FILTER));
  };
};

export const fetchFacetsByTypeAndSearchStringAction = (type, searchString) => {
  return async (dispatch, getState) => {
    const state = getState();
    const activeNavigators = selectActiveNavigators(state);
    const oldFacetData = selectFacetData(state);

    try {
      const xhr = fetchFacetsByTypeAndSearchString(state, type, searchString);
      dispatch(requestStartAction(REQ_FACETS_PER_TYPE_AND_SEARCH_STRING, xhr));
      const data = await promisifyXhr(xhr);

      const newFacetData = transformFacetDataToList(JSON.parse(data)['facets'], activeNavigators);
      const facetData = uniqBy([...oldFacetData, ...newFacetData], 'id');

      dispatch(setFacetData(facetData));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_FACETS_PER_TYPE_AND_SEARCH_STRING));
  };
};

/**
 * Declare debounced (or throttled) actions like this:
 *
 * const debouncedAction = debounce((dispatch, ...args)=>dispatch(action(...args)), DEBOUNCE_TIME)
 * const readyToMap = (...args)=>dispatch=>debouncedAction(dispatch, ...args)
 *
 * You can't map the debounced action directly into a component,
 * since this would cause the function to be redeclared on every new render => debounce would not work.
 *
 * For debounce/throttle please refer to e.g.
 * https://css-tricks.com/debouncing-throttling-explained-examples/
 * https://lodash.com/docs/4.17.15#debounce
 * https://lodash.com/docs/4.17.15#throttle
 *
 */
const dispatch_fetchFacetsByTypeAndSearchStringAction = debounce(
  (dispatch, ...args) => dispatch(fetchFacetsByTypeAndSearchStringAction(...args)),
  200
);

/**
 * debounced action, ready to map into a component
 */
export const debounced_fetchFacetsByTypeAndSearchStringAction = (...args) => (dispatch) =>
  dispatch_fetchFacetsByTypeAndSearchStringAction(dispatch, ...args);
