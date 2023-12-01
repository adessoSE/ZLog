import { SET_SEARCH_TEXT } from './searchText.actionTypes';

export const setSearchText = (value) => {
  return {
    type: SET_SEARCH_TEXT,
    payload: value,
  };
};
