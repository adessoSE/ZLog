/**
 * builds query string part for when application is in markedOnly mode by concatenating ids of marked rows
 */
export function buildQueryForMarkedRows(markedRowsAsObject = {}) {
  const markedRows = Object.keys(markedRowsAsObject).filter((id) => markedRowsAsObject[id]);

  let queryPart = '';
  if (markedRows.size !== 0) {
    let selKey = 'id';
    queryPart += 'fq=';
    markedRows.forEach((id) => {
      queryPart += selKey + ':' + id + ' OR ';
    });
    // trim last " OR " characters
    queryPart = queryPart.slice(0, -4);
  }
  return queryPart;
}

export function getMarkedIds(markedRowsAsObject = {}) {
  return Object.keys(markedRowsAsObject).filter((id) => markedRowsAsObject[id]);
}
