import { transformReduxStateToOldState } from './helper/transformReduxStateToOldState';
import moment from 'moment';
import QueryBuilder from '../utils/QueryBuilder';
import { getFiltersFromState } from './helper/buildQueryForFilterSelected';
import { getFacetFilters } from './helper/buildQueryForFacetSelected';
import { selectIsAnyRowMarked } from '../Redux/list/list.selectors';
import { buildSearchTextQuery } from './helper/buildSearchTextQuery';
import { formatDate } from './helper/formatDateForCSV';
import { getApplicationFilter } from './helper/buildQueryForApplicationChoosed';

/**
 * Fetches the currently displayed list as csv and downloads the file
 */
export function downloadCSV(reduxState) {
  const state = transformReduxStateToOldState(reduxState);

  if (!state.listdata.length) {
    // return if list is empty
    return;
  }

  const topEntry = state.listdata[0];
  const botEntry = state.listdata[state.listdata.length - 1];

  //const startTime = moment(topEntry.time, 'DD.MM.yyyy HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm:ss.SSS\\Z');
  //const endTime = moment(botEntry.time, 'DD.MM.yyyy HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm:ss.SSS\\Z');
  const startTime = moment(formatDate(botEntry.time), moment.DATETIME_LOCAL_SECONDS).toISOString();
  const endTime = moment(formatDate(topEntry.time), moment.DATETIME_LOCAL_SECONDS).toISOString();

  const xhr = new QueryBuilder()
    .newQuery()
    .setQ(buildSearchTextQuery(state.searchText))
    .setStartTime(startTime)
    .setEndTime(endTime)
    .setFacetOn(true)
    .addFacetFields(state.activeNavigators)
    .setRows(1500)
    .setFacetMincount(1)
    .setFacetLimit(state.facetStartLimit)
    .setFieldList(state.activeFields.concat(['id', 'time', 'level']))
    .addSorting('time', 'DESC')
    // .addSorting('counterId', 'DESC')
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
