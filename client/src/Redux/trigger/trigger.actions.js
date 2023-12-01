import {
  REQ_TRIGGER_DELETE,
  REQ_TRIGGER_GET_ALL,
  REQ_TRIGGER_SAVE,
  REQ_TRIGGER_TOGGLE_ENABLED,
} from '../../utils/requestTypes';

import * as TriggerRequest from '../../API/trigger.api';
import { requestEndAction, requestStartAction } from '../actions';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { errorHandler } from '../../utils/errorHandler';

export const deleteTrigger = (trigger, success = () => {}) => {
  return async (dispatch) => {
    try {
      const xhr = TriggerRequest.deleteTriggerRequest(trigger);
      dispatch(requestStartAction(REQ_TRIGGER_DELETE, xhr));
      const response = await promisifyXhr(xhr);

      success(response);
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_TRIGGER_DELETE));
  };
};

export const saveTrigger = (doc, success = () => {}) => {
  return async (dispatch) => {
    try {
      const xhr = TriggerRequest.saveTriggerRequest(doc);
      dispatch(requestStartAction(REQ_TRIGGER_SAVE, xhr));
      const response = await promisifyXhr(xhr);

      success(response);
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_TRIGGER_SAVE));
  };
};

export const fetchAllTriggers = (success = () => {}) => {
  return async (dispatch) => {
    try {
      const xhr = TriggerRequest.fetchAllTriggersRequest();
      dispatch(requestStartAction(REQ_TRIGGER_GET_ALL, xhr));
      const response = await promisifyXhr(xhr);

      success(response);
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_TRIGGER_GET_ALL));
  };
};

export const toggleTriggerEnabled = (trigger, success = () => {}) => {
  return async (dispatch) => {
    try {
      const xhr = TriggerRequest.toggleTriggerEnabledRequest(trigger);
      dispatch(requestStartAction(REQ_TRIGGER_TOGGLE_ENABLED, xhr));
      const response = await promisifyXhr(xhr);
      success(response);
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_TRIGGER_TOGGLE_ENABLED));
  };
};
