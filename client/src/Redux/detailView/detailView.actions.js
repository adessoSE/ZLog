import { REQ_SPECIFIC_DOCUMENT, REQ_COMMENT_ADD, REQ_COMMENT_DELETE, REQ_COMMENT_EDIT } from '../../utils/requestTypes';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { errorHandler } from '../../utils/errorHandler';
import { requestEndAction, requestStartAction } from '../actions';
import { fetchSpecificDocument } from '../../API/document.api';
import { addComment, deleteComment, editComment, extractCommentsForLog } from '../../API/comment.api';
// import { da } from 'date-fns/locale';

export const SET_DETAIL_VIEW_OPEN = 'SET_DETAIL_VIEW_OPEN';
export const TOGGLE_DETAIL_VIEW_OPEN = 'TOGGLE_DETAIL_VIEW_OPEN';
export const SET_DOCUMENT = 'SET_DOCUMENT';
export const SET_DETAIL_VIEW_DOCUMENT_ID = 'SET_DETAIL_VIEW_DOCUMENT_ID';
export const SET_COMMENT_DATA = 'SET_COMMENT_DATA';

export function setDetailViewOpenAction(open) {
  return {
    type: SET_DETAIL_VIEW_OPEN,
    payload: open,
  };
}

export function toggleDetailViewOpenAction() {
  return {
    type: TOGGLE_DETAIL_VIEW_OPEN,
  };
}

export function setDocumentAction(document) {
  return {
    type: SET_DOCUMENT,
    payload: document,
  };
}

export function setDocumentIDAction(document) {
  return {
    type: SET_DETAIL_VIEW_DOCUMENT_ID,
    payload: document,
  };
}

export function setCommentData(commentData) {
  return {
    type: SET_COMMENT_DATA,
    payload: commentData,
  };
}

export function showDetailViewForDocument(id) {
  return async (dispatch) => {
    dispatch(setDetailViewOpenAction(true));
    try {
      const xhr = fetchSpecificDocument(id);
      dispatch(requestStartAction(REQ_SPECIFIC_DOCUMENT, xhr));
      const data = await promisifyXhr(xhr);
      const documentObj = JSON.parse(data);
      let document = documentObj.log;
      document['id'] = documentObj.id;
      dispatch(setDocumentAction(document));
      dispatch(setDocumentIDAction(document.id));
      dispatch(extractCommentsForDocument(document));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_SPECIFIC_DOCUMENT));
  };
}

export function extractCommentsForDocument(doc) {
  return async (dispatch) => {
    try {
      const comments = await extractCommentsForLog(doc);
      dispatch(setCommentData(comments));
    } catch (error) {
      errorHandler(error);
    }
  };
}

export function addCommentAction(author, comment, selectedConditions, updateCommentData, callback) {
  return async (dispatch) => {
    try {
      const xhr = addComment(author, comment, selectedConditions, updateCommentData);
      dispatch(requestStartAction(REQ_COMMENT_ADD, xhr));
      await promisifyXhr(xhr);
      if (callback) {
        callback();
      }
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_COMMENT_ADD));
  };
}

export function deleteCommentAction(id, callback) {
  return async (dispatch) => {
    try {
      const xhr = deleteComment(id, callback);
      dispatch(requestStartAction(REQ_COMMENT_DELETE, xhr));
      await promisifyXhr(xhr);
      callback();
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_COMMENT_DELETE));
  };
}

export function editCommentAction(commentId, comment, selectedConditions, updateCommentData) {
  return async (dispatch) => {
    try {
      const xhr = editComment(commentId, comment, selectedConditions, updateCommentData);
      dispatch(requestStartAction(REQ_COMMENT_EDIT, xhr));
      await promisifyXhr(xhr);
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_COMMENT_EDIT));
  };
}
