import { selectFilterFacetDataGroupedByType } from '../../Redux/facet/facet.selectors';

export function buildQueryForFilterSelected(filterSelected) {
  var queryPart = '';
  var keys = Object.keys(filterSelected);
  keys.forEach((key) => {
    //console.log(key);
    var negated = filterSelected[key]['negated'];
    if (filterSelected[key].length !== 0) {
      queryPart += 'fq=';
      filterSelected[key].values.forEach((subtype) => {
        if (negated) {
          queryPart += '-' + key + ':' + subtype + ' OR ';
        } else {
          queryPart += key + ':' + subtype + ' OR ';
        }
      });
      // trim last " OR " characters
      queryPart = queryPart.slice(0, -4);
      queryPart += '&';
    }
  });

  // trim last "&";
  queryPart = queryPart.slice(0, -1);
  return queryPart;
}

export function getFiltersFromState(reduxState) {
  let filters = null;
  if (reduxState) {
    let res = selectFilterFacetDataGroupedByType(reduxState);
    if (res) {
      filters = [];
      let keys = Object.keys(res);
      keys.forEach((key) => {
        let filter = { key: key, values: res[key].values, negated: res[key].negated };
        filters.push(filter);
      });
    }
  }
  return filters;
}
