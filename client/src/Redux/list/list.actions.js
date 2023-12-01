import { selectListData, selectNewestListItem, selectOldestListItem } from './list.selectors';
import { REQ_LIST_AND_FACETS, REQ_LIST_AND_FACETS_NEW, REQ_LIST_AND_FACETS_OLD } from '../../utils/requestTypes';
import { selectActiveNavigators } from '../selectors';
import { fetchFromStartToEnd } from '../../API/list.api';
import { requestEndAction, requestStartAction } from '../actions';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { prepareDataForResultList } from './list.helper';
import { transformFacetDataToList } from '../facet/facet.helper';
import * as actions from '../actions';
import { errorHandler } from '../../utils/errorHandler';
import moment from 'moment';
import Constants from '../../utils/Constants';
import {
  CHANGE_LIST_SLICE,
  RESET_UNREAD_DATA,
  SET_SHOW_MARKED_ROWS_ONLY,
  TOGGLE_MARKED_ROWS,
  UPDATE_COLUMN_WIDTHS,
  UPDATE_LAST_REQUEST_TYPE,
  UPDATE_LIST_DATA,
  UPDATE_RECENTLY_FETCHED_DATA,
  UPDATE_UNREAD_DATA,
} from './list.actionTypes';

/**
 *
 * @param {Object[]} payload - array of list items that should replace list data
 * @returns {{payload: Object[], type: string}}
 */
export const updateListData = (payload) => {
  return {
    type: UPDATE_LIST_DATA,
    payload,
  };
};

/**
 * dispatches list data update
 * merges newListData with oldListData, free of duplicates
 *
 */
export const addListData = (newListData, prependNewData = false) => {
  return (dispatch, getState) => {
    const state = getState();
    const oldListData = selectListData(state);
    // remove duplicates
    const newListDataWithoutDuplicates = newListData.filter(
      (data) => !oldListData.find((oldData) => data.id === oldData.id)
    );

    const listData = prependNewData
      ? [...newListDataWithoutDuplicates, ...oldListData]
      : [...oldListData, ...newListDataWithoutDuplicates];

    // add duplicate free list to recentlyFetchedData
    dispatch(updateRecentlyFetchedData(newListDataWithoutDuplicates));

    // newer logs should be stored in unreadData
    if (prependNewData) {
      const unreadDataObject = newListDataWithoutDuplicates.reduce((acc, next) => {
        return { ...acc, [next.id]: true };
      }, {});
      dispatch(updateUnreadData(unreadDataObject));
    }

    dispatch(updateListData(listData));
  };
};

export const prependListData = (newListData) => addListData(newListData, true);
export const appendListData = (newListData) => addListData(newListData, false);

export const toggleMarkedRows = (payload) => {
  return {
    type: TOGGLE_MARKED_ROWS,
    payload,
  };
};

export const setShowMarkedOnly = (payload) => {
  return {
    type: SET_SHOW_MARKED_ROWS_ONLY,
    payload,
  };
};

export const changeListSlice = (payload) => {
  return {
    type: CHANGE_LIST_SLICE,
    payload,
  };
};

export const setSortUp = (sortUp) => {
  return changeListSlice({ sortUp });
};

/**
 *
 * @param {Object[]} payload
 * @returns {{payload: *, type: string}}
 */
export const updateRecentlyFetchedData = (payload) => {
  return {
    type: UPDATE_RECENTLY_FETCHED_DATA,
    payload,
  };
};

/**
 *
 * @param {Object} payload - like : { id1: true, id2: true }
 * @returns {{payload: *, type: string}}
 */
export const updateUnreadData = (payload) => {
  return {
    type: UPDATE_UNREAD_DATA,
    payload,
  };
};

export const resetUnreadData = () => {
  return { type: RESET_UNREAD_DATA };
};

/**
 *
 * @param {Object} payload - like : { time: 60, level: 100 }
 * @returns {{payload: *, type: string}}
 */
export const updateColumnWidths = (payload) => {
  return {
    type: UPDATE_COLUMN_WIDTHS,
    payload,
  };
};

/**
 *
 * @param {string} payload - like in requestTypes.js
 * @returns {{payload: *, type: string}}
 */
export const updateLastRequestType = (payload) => {
  return {
    type: UPDATE_LAST_REQUEST_TYPE,
    payload,
  };
};

/**
 * aka. the great fetch action!
 *
 * @param {object} params
 *
 */
export function fetchFromStartToEndAction(params = {}) {
  const requestType = REQ_LIST_AND_FACETS;

  return async (dispatch, getState) => {
    dispatch(resetUnreadData());
    dispatch(updateLastRequestType(requestType));
    const state = getState();

    try {
      const xhr = fetchFromStartToEnd(state, params);
      dispatch(requestStartAction(requestType, xhr));

      const originalData = await promisifyXhr(xhr);

      const data = JSON.parse(originalData);
      const listData = prepareDataForResultList(data);
      dispatch(updateListData(listData));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(requestType));
  };
}

/**
 * fetching additional data for result list and facets.
 *
 * @param {object} params
 * @param {boolean} prependNewData - true == new data / false == older data
 * @param {string} requestType
 *
 */
export function fetchAdditionalLogsAndFacetsAction(
  params = {},
  prependNewData = false,
  requestType = REQ_LIST_AND_FACETS
) {
  return async (dispatch, getState) => {
    dispatch(updateLastRequestType(requestType));

    const state = getState();
    const activeNavigators = selectActiveNavigators(state);

    try {
      // fetch
      const xhr = fetchFromStartToEnd(state, params);
      dispatch(requestStartAction(requestType, xhr));
      const originalData = await promisifyXhr(xhr);
      // add list data
      const data = JSON.parse(originalData);
      const listData = prepareDataForResultList(data);

      dispatch(addListData(listData, prependNewData));

      // prependNewData => new data fetched => add to facets and total found count
      if (prependNewData) {
        // add to total found
        dispatch(actions.addToTotalFound(data['totalResponseCount']));

        // add to facet data
        const newFacetData = transformFacetDataToList(data['facets'], activeNavigators);

        dispatch(actions.addFacetData(newFacetData));
      }
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(requestType));
  };
}

/**
 * fetching newer data
 */
export function fetchNewerLogsAction() {
  return function (dispatch, getState) {
    const state = getState();
    const newestLog = selectNewestListItem(state);
    if (!newestLog) {
      return; // no item === no action needed
    }

    const newestLogTime = moment(newestLog['time'], 'DD.MM.YYYY HH:mm:ss.SSS').valueOf();
    const params = {
      startTimeOffset: -1,
      startFrom: newestLogTime,
    };
    dispatch(fetchAdditionalLogsAndFacetsAction(params, true, REQ_LIST_AND_FACETS_NEW));
  };
}

/**
 * fetching older data
 */
export function fetchOlderLogsAction() {
  return function (dispatch, getState) {
    const state = getState();
    const oldestLog = selectOldestListItem(state);
    if (!oldestLog) {
      return; // no item === no action needed
    }

    const oldestLogTime = moment(oldestLog['time'], 'DD.MM.YYYY HH:mm:ss.SSS').valueOf();
    const params = {
      endTimeOffset: Constants.SCROLLING_OFFSET_MILLIS,
      endTo: oldestLogTime,
    };
    dispatch(fetchAdditionalLogsAndFacetsAction(params, false, REQ_LIST_AND_FACETS_OLD));
  };
}
