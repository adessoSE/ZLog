import { REQUEST_CANCEL, REQUEST_START, REQUEST_CANCEL_ALL } from '../activeRequests/activeRequests.actionTypes';
import { requestCancelAction } from '../actions';

export const STATUS_TEXT_CANCELED = 'REQUEST CANCELED';

let activeRequests = {};

function addToActiveRequests(name, xhr, dispatch) {
  // cancel if xhr exists that is not DONE (=> readyState === 4)
  if (activeRequests[name] && activeRequests[name].readyState !== 4) {
    dispatch(requestCancelAction(name));
  }

  activeRequests = {
    ...activeRequests,
    [name]: xhr,
  };
}

function cancelRequest(name) {
  if (activeRequests[name]) {
    const xhr = activeRequests[name];
    xhr.abort(STATUS_TEXT_CANCELED);

    removeCancelFn(name);
  }
}

function removeCancelFn(name) {
  activeRequests = {
    ...activeRequests,
    [name]: null,
  };
}

function cancelAllRequests() {
  // eslint-disable-next-line no-unused-vars
  for (let name in activeRequests) {
    if (activeRequests.hasOwnProperty(name) && activeRequests[name]) {
      cancelRequest(name);
    }
  }
}

export const cancelRequestsMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action.type === REQUEST_START && action.xhr) {
    addToActiveRequests(action.payload, action.xhr, dispatch);
  }
  if (action.type === REQUEST_CANCEL) {
    cancelRequest(action.payload);
  }
  if (action.type === REQUEST_CANCEL_ALL) {
    cancelAllRequests();
  }

  next(action);
};
