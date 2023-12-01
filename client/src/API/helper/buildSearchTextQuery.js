/**
 * Query part for query
 */
export function buildSearchTextQuery(searchText) {
  let searchQuery = searchText;
  if (!searchText || 0 === searchText.length || 0 === searchText.replace(/\s/g, '').length) {
    searchQuery = '*:*';
  } else if (searchText.includes('*') || searchText.includes(':')) {
    searchQuery = searchText.toString();
  } else {
    searchQuery = '*' + searchText + '*';
  }
  return searchQuery;
}
