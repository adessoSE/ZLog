const PREFIX = 'fq=';
const CONNECTOR = ' OR ';

export function buildQueryForFacetSelected(facetSelected) {
  const selectedFacetsAsList = getListOfTruthyProps(facetSelected);
  if (!selectedFacetsAsList.length) {
    return null; // as query builder expects
  } else {
    return PREFIX + selectedFacetsAsList.join(CONNECTOR);
  }
}

function getListOfTruthyProps(obj = {}) {
  return Object.keys(obj).filter((key) => obj[key]);
}

export function getSelectedFacets(facetSelected) {
  const selectedFacetsAsList = getListOfTruthyProps(facetSelected);
  if (!selectedFacetsAsList.length) {
    return null;
  } else {
    return selectedFacetsAsList;
  }
}

/**
 *
 * @param {*} state redux state
 * @returns An array with a filter object for the api, corresponding to the selected facets
 */
export function getFacetFilters(state) {
  let facets = getSelectedFacets(state.facetSelected);
  let filters = null;

  // facets has this format: ["component:marco-bp-monitor", ...]
  // facetdata like this: [{type: "component", subtype: "marco-bp-monitor", id: "component:marco-bp-monitor"}, ...]
  if (Array.isArray(state.facetdata) && Array.isArray(facets) && facets.length > 0) {
    let facetData;
    let values = []; // only one type can be selected, but with multiple values
    // eslint-disable-next-line no-unused-vars
    for (let facet of facets) {
      facetData = state.facetdata.find((x) => x.id === facet);
      if (facetData) {
        values.push(facetData.subtype);
      }
    }
    if (values.length > 0) {
      filters = [{ key: facetData.type, values: values, negated: false }];
    }
  }
  return filters;
}
