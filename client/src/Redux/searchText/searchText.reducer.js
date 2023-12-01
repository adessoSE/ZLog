import { SET_SEARCH_TEXT } from './searchText.actionTypes';

export const initialState = '';

export const searchTextReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_SEARCH_TEXT:
      return payload;
    default:
      return state;
  }
};
