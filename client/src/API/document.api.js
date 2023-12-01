import QueryBuilder from '../utils/QueryBuilder';

/**
 * Fetches only the document with the given id with all existing fields. Returns the document itself as json
 * May be undefined if there is no such document
 * @param {string} documentId UUID of the document to fetch
 * @returns {XMLHttpRequest}
 */
export function fetchSpecificDocument(documentId) {
  return new QueryBuilder().sendGetDocument(documentId);
  // .then((data) => data.response.docs[0]);
}
