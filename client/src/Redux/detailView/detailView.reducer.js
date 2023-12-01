import {
  SET_DETAIL_VIEW_OPEN,
  TOGGLE_DETAIL_VIEW_OPEN,
  SET_DOCUMENT,
  SET_DETAIL_VIEW_DOCUMENT_ID,
  SET_COMMENT_DATA,
} from './detailView.actions';

const initialState = {
  isDetailViewOpen: false,
  document: null,
  documentID: -1,
  commentData: null,
};

export function detailViewReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_DETAIL_VIEW_OPEN:
      return { ...state, isDetailViewOpen: payload };
    case TOGGLE_DETAIL_VIEW_OPEN:
      return { ...state, isDetailViewOpen: !state.isDetailViewOpen };
    case SET_DOCUMENT:
      return { ...state, document: payload };
    case SET_DETAIL_VIEW_DOCUMENT_ID:
      return { ...state, documentID: payload };
    case SET_COMMENT_DATA:
      return { ...state, commentData: payload };
    default:
      return state;
  }
}
