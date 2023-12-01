import {
  ADD_LIST_DATA,
  CHANGE_LIST_SLICE,
  TOGGLE_MARKED_ROWS,
  UPDATE_LIST_DATA,
  SET_SHOW_MARKED_ROWS_ONLY,
  UPDATE_RECENTLY_FETCHED_DATA,
  UPDATE_UNREAD_DATA,
  UPDATE_COLUMN_WIDTHS,
  UPDATE_LAST_REQUEST_TYPE,
  RESET_UNREAD_DATA,
} from './list.actionTypes';

export const initialState = {
  data: [],
  sortUp: true,
  markedOnly: false,
  markedRows: {},
  recentlyFetchedData: [],
  unreadData: {},
  columnWidths: {},
  lastRequestType: '',
};

export const listDataReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_LIST_DATA:
      return {
        ...state,
        data: [...payload],
      };
    case ADD_LIST_DATA:
      return {
        ...state,
        data: [...state.data, ...payload],
      };
    case TOGGLE_MARKED_ROWS:
      return {
        ...state,
        markedRows: markedRowsHelper(state.markedRows, payload),
      };
    case SET_SHOW_MARKED_ROWS_ONLY:
      return { ...state, markedOnly: payload };
    case CHANGE_LIST_SLICE:
      return {
        ...state,
        ...payload,
      };
    case UPDATE_RECENTLY_FETCHED_DATA:
      return {
        ...state,
        recentlyFetchedData: [...payload],
      };
    case UPDATE_UNREAD_DATA:
      return {
        ...state,
        unreadData: { ...state.unreadData, ...payload },
      };
    case RESET_UNREAD_DATA:
      return {
        ...state,
        unreadData: {},
      };
    case UPDATE_COLUMN_WIDTHS:
      return {
        ...state,
        columnWidths: { ...state.columnWidths, ...payload },
      };
    case UPDATE_LAST_REQUEST_TYPE:
      return {
        ...state,
        lastRequestType: payload,
      };
    default:
      return state;
  }
};

/**
 * returns a new state object with toggled booleans per id, like
 * {
 *     id123: false
 *     id456: true
 * }
 *
 * @param state
 * @param {string[]} arrayOfIds
 * @returns {{}}
 */
function markedRowsHelper(state = {}, arrayOfIds = []) {
  const result = { ...state };
  arrayOfIds.forEach((id) => {
    result[id] = !result[id];
  });
  return result;
}
