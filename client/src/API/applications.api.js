import QueryBuilder from '../utils/QueryBuilder';

export function fetchAllApplications() {
  const xhr = new QueryBuilder().newQuery().setFacetOn(true).addFacetFields(['application']).send();

  return xhr;
}
