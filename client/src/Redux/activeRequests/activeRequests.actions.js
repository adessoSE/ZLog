import { REQUEST_CANCEL, REQUEST_CANCEL_ALL, REQUEST_END, REQUEST_START } from './activeRequests.actionTypes';

/**
 *
 * @param {string} requestType
 * @param {XMLHttpRequest} xhr - needed for cancellation
 * @returns {{payload: string, type: string}}
 */
export function requestStartAction(requestType = 'any', xhr) {
  return { type: REQUEST_START, payload: requestType, xhr };
}

export function requestCancelAction(requestType = 'any') {
  return { type: REQUEST_CANCEL, payload: requestType };
}

export function requestCancelAllAction() {
  return { type: REQUEST_CANCEL_ALL };
}

/**
 *
 * @param {string} requestType
 * @returns {{payload: string, type: string}}
 */
export function requestEndAction(requestType = 'any') {
  return { type: REQUEST_END, payload: requestType };
}
