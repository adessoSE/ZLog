import { createSelector } from 'reselect';
import { getListOfTruthyProps } from '../../utils/getListOfTruthyProps';

export const selectFacetData = (state) => state.facet.data;
export const selectSelectedFacetData = (state) => state.facet.selected;
export const selectFilterText = (state) => state.facet.filterText;
export const selectFilterFacetData = (state) => state.facet.filter;
export const selectFacetStartLimit = (state) => state.facet.facetStartLimit;
export const selectTotalFound = (state) => state.facet.totalFound;
export const selectNegatedFilterTypes = (state) => state.facet.negatedTypes;
export const selectIsFacetTypeNegated = (state, type) => !!state.facet.negatedTypes[type];

/**
 * returns a list of selected facets, like ["component:abc", component:xyz"]
 */
export const selectSelectedFacetDataAsList = (state) => getListOfTruthyProps(selectSelectedFacetData(state));

export const selectIsAnyFilterActive = (state) => getListOfTruthyProps(selectFilterFacetData(state)).length > 0;

/**
 * returns object for filters in the shape that is
 * expected by component and query build helper (aka "the old shape"),
 * like...
 * {component:{negated:true, values:["abc"]}}
 */
export const selectFilterFacetDataGroupedByType = (state) => {
  const filteredFacets = selectFilterFacetData(state);
  const negatedTypes = selectNegatedFilterTypes(state);

  const result = {};

  // eslint-disable-next-line no-unused-vars
  for (let id in filteredFacets) {
    if (filteredFacets[id]) {
      const [type, subtype] = id.split(':');
      if (result[type]) {
        result[type].negated = !!negatedTypes[type];
        result[type].values.push(subtype);
      } else {
        result[type] = { negated: !!negatedTypes[type], values: [subtype] };
      }
    }
  }
  return result;
};

/**
 * returns facet data per type
 */
export const selectFacetDataByType = (state, type) => selectFacetData(state).filter((facet) => facet.type === type);

/**
 * returns the sum of all selected facets
 */
export const selectTotalSelectedCount = createSelector(
  selectFacetData,
  selectSelectedFacetData,
  (facetData, selected) => {
    let count = 0;
    facetData.forEach((facet) => {
      if (selected[facet.id]) {
        count += facet.count;
      }
    });
    return count;
  }
);
