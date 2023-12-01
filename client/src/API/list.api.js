import QueryBuilder from '../utils/QueryBuilder';
import moment from 'moment';

import { transformReduxStateToOldState } from './helper/transformReduxStateToOldState';
import { getApplicationFilter } from './helper/buildQueryForApplicationChoosed';
import { buildSearchTextQuery } from './helper/buildSearchTextQuery';
import { selectIsAnyRowMarked } from '../Redux/list/list.selectors';
import { getFacetFilters } from './helper/buildQueryForFacetSelected';
import { getFiltersFromState } from './helper/buildQueryForFilterSelected';

/**
 *
 * @param reduxState
 * @param params
 * @returns {XMLHttpRequest}
 */
export function fetchFromStartToEnd(reduxState, params) {
  const { startTimeOffset = undefined, endTimeOffset = undefined, facetOn = true, sort = 'DESC' } = params;

  let newRows = 500;
  if (startTimeOffset !== undefined || endTimeOffset !== undefined) {
    newRows = 100;
  }
  const state = transformReduxStateToOldState(reduxState);

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .setStartTime(getStartTime(params, state))
    .setEndTime(getEndTime(params, state))
    .setFacetOn(facetOn)
    .addFacetFields(facetOn ? state.activeNavigators : null)
    .setRows(newRows)
    .setFacetMincount(1)
    .setFacetLimit(state.facetStartLimit)
    .setFieldList(state.activeFields.concat(['id', 'time', 'level']))
    .addSorting('time', sort)
    // .addSorting('counterId', sort)
    .setFilters(Object.keys(state.filterSelected).length !== 0 ? getFiltersFromState(reduxState) : null)
    .addFilters(
      Object.entries(state.facetSelected).length !== 0 && state.facetSelected.constructor === Object
        ? getFacetFilters(state)
        : null
    )
    .setMarkedIds(state.markedOnly && selectIsAnyRowMarked(reduxState) ? state.markedRows : null)
    .addFilters(state.choosedApplication.length !== 0 ? getApplicationFilter(state.choosedApplication) : null)
    .send();

  return xhr;
}

// getStartTime
function getStartTime(params, state) {
  const { startTimeOffset = 0, startFrom = undefined } = params;

  if (state.markedOnly) {
    return null;
  } else if (startFrom) {
    return moment(Math.max(state.startTime, startFrom - startTimeOffset)).toISOString();
  } else {
    return moment(state.startTime).toISOString();
  }
}

// getEndTime
function getEndTime(params, state) {
  const { endTimeOffset = 0, endTo = undefined } = params;

  if (state.markedOnly) {
    return null;
  } else if (endTo) {
    return moment(Math.min(state.endTime, endTo + endTimeOffset)).toISOString();
  } else {
    return moment(state.endTime).toISOString();
  }
}
