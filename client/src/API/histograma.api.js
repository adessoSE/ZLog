import moment from 'moment';
import { transformReduxStateToOldState } from './helper/transformReduxStateToOldState';
import QueryBuilder from '../utils/QueryBuilder';
import { buildSearchTextQuery } from './helper/buildSearchTextQuery';
import { getFiltersFromState } from './helper/buildQueryForFilterSelected';
import { selectAllMarkedRowIdsAsList, selectIsAnyRowMarked } from '../Redux/list/list.selectors';
import { getApplicationFilter } from './helper/buildQueryForApplicationChoosed';
import { makeOnError } from './helper/makeOnError';

/**
 * returns a promise containing facetted time for time in [state.start, state.end] (data used for histogram)
 */
export function fetchTimeFacet(reduxState, withFilters) {
  const state = transformReduxStateToOldState(reduxState);

  const start = moment(state.startTime);
  const end = moment(state.endTime);

  const gap_as_seconds = !state.markedOnly
    ? Math.floor(moment.duration(end.diff(start) / 200).asSeconds())
    : Math.floor(moment.duration(end.diff(start) / selectAllMarkedRowIdsAsList(reduxState).length).asSeconds());

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .addFilters(withFilters && Object.keys(state.filterSelected).length !== 0 ? getFiltersFromState(reduxState) : null)
    .setIndent(true)
    .setFacetRange('time')
    .setFacetOn(true)
    .setStartTime(start.toISOString())
    .setEndTime(end.toISOString())
    .setFacetRangeStart(start.subtract(60, 'seconds').toISOString())
    .setFacetRangeEnd(end.toISOString())
    .setFacetRangeGap(gap_as_seconds !== 0 ? gap_as_seconds : 60, 'SECONDS')
    .setRows(0)
    .setMarkedIds(state.markedOnly && selectIsAnyRowMarked(reduxState) ? state.markedRows : null)
    .addFilters(state.choosedApplication.length !== 0 ? getApplicationFilter(state.choosedApplication) : null)
    .setErrorHandler(makeOnError('Error occured while fetching time data!'))
    .send();

  return xhr;
}
