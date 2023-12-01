import { SET_VIEWS, SET_NUM_VIEWS, SET_NUM_PAGES_FOR_VIEWS } from './settings.actionTypes';

export const initalState = {
  views: [],
  numViews: 0,
  numPagesForViews: 0,
};

export function settingsReducer(state = initalState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_VIEWS:
      return {
        ...state,
        views: [...payload],
      };
    case SET_NUM_VIEWS:
      return {
        ...state,
        numViews: payload,
      };
    case SET_NUM_PAGES_FOR_VIEWS:
      return {
        ...state,
        numPagesForViews: payload,
      };
    default:
      return state;
  }
}
