import { REQUEST_END, REQUEST_START } from './activeRequests.actionTypes';

export const initialState = {
  active: 0,
  types: {},
};

export function activeRequestsReducer(state = initialState, action) {
  const { type, payload } = action;
  let counter = state.types[payload] || 0;
  switch (type) {
    case REQUEST_START:
      return {
        ...state,
        active: state.active + 1,
        types: {
          ...state.types,
          [payload]: counter + 1,
        },
      };
    case REQUEST_END:
      return {
        ...state,
        active: state.active - 1,
        types: {
          ...state.types,
          [payload]: counter - 1,
        },
      };
    default:
      return state;
  }
}
