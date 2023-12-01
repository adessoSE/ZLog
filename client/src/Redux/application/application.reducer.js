import { SET_ALL_APPLICATIONS, SET_SELECTED_APPLICATION } from './application.actionTypes';

const initialState = {
  all: [],
  selected: 'Alle Systeme',
};

export function applicationReducer(state = initialState, action) {
  let { type, payload } = action;
  switch (type) {
    case SET_ALL_APPLICATIONS:
      return {
        ...state,
        all: [...payload],
      };
    case SET_SELECTED_APPLICATION:
      return {
        ...state,
        selected: payload,
      };
    default:
      return state;
  }
}
