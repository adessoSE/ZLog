import { fetchAllSchemaFields } from '../../API/fields.api';
import { prepareAllFields, prepareAllNavigators } from './fields.helper';
import { requestEndAction, requestStartAction } from '../actions';
import { REQ_FIELDS } from '../../utils/requestTypes';
import { errorHandler } from '../../utils/errorHandler';
import { promisifyXhr } from '../../utils/promisifyXhr';
import * as ActionTypes from './fields.actionTypes';

/**
 *
 * @param {Object[]} payload List of all known fields
 * @returns {{payload: Object[], type: string}}
 */
export const setAllFields = (payload) => {
  return {
    type: ActionTypes.SET_ALL_FIELDS,
    payload,
  };
};

/**
 *
 * @param {Object[]} payload List of active known fields
 * @returns {{payload: Object[], type: string}}
 */
export const setActiveFields = (payload) => {
  return {
    type: ActionTypes.SET_ACTIVE_FIELDS,
    payload,
  };
};

export const addActiveFields = (payload = []) => {
  return {
    type: ActionTypes.ADD_ACTIVE_FIELDS,
    payload,
  };
};

export const removeActiveFields = (payload = []) => {
  return {
    type: ActionTypes.REMOVE_ACTIVE_FIELDS,
    payload,
  };
};
/**
 *
 * @param {Object[]} payload List of active known navigators
 * @returns {{payload: Object[], type: string}}
 */
export const setAllNavigators = (payload) => {
  return {
    type: ActionTypes.SET_ALL_NAVIGATORS,
    payload,
  };
};

/**
 *
 * @param {Object[]} payload List of active known navigators
 * @returns {{payload: Object[], type: string}}
 */
export const setActiveNavigators = (payload) => {
  return {
    type: ActionTypes.SET_ACTIVE_NAVIGATORS,
    payload,
  };
};

export function fieldsRequestAction(callback) {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const xhr = fetchAllSchemaFields(state);
      dispatch(requestStartAction(REQ_FIELDS, xhr));
      const data = await promisifyXhr(xhr);

      dispatch(setAllFields(prepareAllFields(data)));
      dispatch(setAllNavigators(prepareAllNavigators(data)));

      callback();
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_FIELDS));
  };
}
