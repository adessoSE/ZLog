import moment from 'moment';
import { transformReduxStateToOldState } from './helper/transformReduxStateToOldState';
import QueryBuilder from '../utils/QueryBuilder';
import { getFiltersFromState } from './helper/buildQueryForFilterSelected';
import { selectFacetDataByType } from '../Redux/facet/facet.selectors';
import { selectIsAnyRowMarked } from '../Redux/list/list.selectors';
import { getSelectedFacets } from './helper/buildQueryForFacetSelected';
import { buildSearchTextQuery } from './helper/buildSearchTextQuery';
import {getApplicationFilter} from "./helper/buildQueryForApplicationChoosed";

export function fetchFacetsByTypeAndSearchString(reduxState, type, searchText) {
  const state = transformReduxStateToOldState(reduxState);

  let start = moment(state.startTime);
  let end = moment(state.endTime);

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .setStartTime(start.toISOString())
    .setEndTime(end.toISOString())
    .setFacetOn(true)
    .addFacetFields(type)
    .setFacetFieldSearchText(searchText)
    .setFilters(Object.keys(state.filterSelected).length !== 0 ? getFiltersFromState(reduxState) : null)
    .setFacetMincount(1)
    .setFacetLimit(2147483647)
    .setRows(0)
    .setMarkedIds(state.markedOnly && selectIsAnyRowMarked(reduxState) ? state.markedRows : null)
    .setErrorHandler((jqXHR) => {
      console.error(jqXHR, 'Error occured while fetching time data!');
      // requestErrorHandler(jqXHR, 'An error occured while searching!')
    })
    .setSuccessHandler(() => {})
    .send();

  // xhr.then((data) => callback(SearchAPI.prepareDataForSearchResult(data, type)));

  return xhr;
}

export function fetchFacetsForUpdatedSearchTextOrFilter(reduxState) {
  const state = transformReduxStateToOldState(reduxState);

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .setStartTime(moment(state.startTime).toISOString())
    .setEndTime(moment(state.endTime).toISOString())
    .setFilters(Object.keys(state.filterSelected).length !== 0 ? getFiltersFromState(reduxState) : null)
    .setFacetOn(true)
    .addFacetFields(state.activeNavigators, true)
    .setRows(0)
    .setFacetMincount(1)
    .setFacetLimit(10)
    .addFilters(state.choosedApplication.length !== 0 ? getApplicationFilter(state.choosedApplication) : null)
    .setMarkedIds(state.markedOnly && selectIsAnyRowMarked(reduxState) ? state.markedRows : null)
    .setErrorHandler((jqXHR) => {
      console.error(jqXHR, 'Error occured while fetching time data!');
      // pc.requestErrorHandler(jqXHR, 'An error occured while retrieving facets!')
    })
    .setSuccessHandler(() => {})
    .send();

  return xhr;
}

export function fetchOnlyFacetsForKey(reduxState, type) {
  const state = transformReduxStateToOldState(reduxState);
  const facetOffset = selectFacetDataByType(reduxState, type).length;
  const facetLimit = 20; // configurable ?

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .setStartTime(moment(state.startTime).toISOString())
    .setEndTime(moment(state.endTime).toISOString())
    .setFilters(Object.keys(state.filterSelected).length !== 0 ? getFiltersFromState(reduxState) : null)
    .addFacetFields(
      Object.entries(state.facetSelected).length !== 0 && state.facetSelected.constructor === Object
        ? getSelectedFacets(state.facetSelected)
        : null
    )
    .setFacetOn(true)
    .addFacetFields(type)
    .setRows(0)
    .setFacetMincount(1)
    .setFacetLimit(facetLimit)
    .setFacetOffset(facetOffset)
    .setMarkedIds(state.markedOnly && selectIsAnyRowMarked(reduxState) ? state.markedRows : null)
    .setErrorHandler((jqXHR) => {
      console.error(jqXHR, 'Error occured while fetching time data!');
      // pc.requestErrorHandler(jqXHR, 'An error occured while retrieving facets!')
    })
    .setSuccessHandler(() => {})
    .send();

  return xhr;
}
