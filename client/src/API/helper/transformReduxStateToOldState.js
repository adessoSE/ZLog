import {
  selectEndTime,
  selectIntermediateEndTime,
  selectIntermediateStartTime,
  selectStartTime,
} from '../../Redux/time/time.selectors';
import { selectHistogramData } from '../../Redux/histogram/histogram.selectors';
import {
  selectListData,
  selectListIsLoading,
  selectListMarkedOnly,
  selectListMarkedRows,
  selectListSortUp,
  selectListToScrollId,
} from '../../Redux/list/list.selectors';
import { selectSearchText } from '../../Redux/searchText/searchText.selectors';
import {
  selectFacetData,
  selectFacetStartLimit,
  selectFilterFacetData,
  selectFilterText,
  selectSelectedFacetData,
  selectTotalFound,
} from '../../Redux/facet/facet.selectors';
import { selectLiveViewActive, selectLiveViewUpdateFrequency } from '../../Redux/liveView/liveView.selectors';
import {
  selectActiveFields,
  selectActiveNavigators,
  selectAllFields,
  selectAllNavigators,
} from '../../Redux/fields/fields.selectors';
import { selectNumPagesForViews, selectViews, selectNumViews } from '../../Redux/settings/settings.selectors';
import { selectAllApplications, selectSelectedApplication } from '../../Redux/application/application.selectors';

/**
 * returns an object shaped like the old state from ParentController.
 * This is a workaround while refactoring.
 *
 * @param {Object}reduxState
 * @returns {{allFields: [], facetStartLimit: number, justSwitched: boolean, markedOnly: boolean, currentAbortControllerFullFetch: null, liveViewActive: boolean, markedRows: Set<any>, searchText: *, currentAbortControllerHistogram: null, numFound: number, sortUp: boolean, allNavigators: [], startTime: *, views: [], numPagesForViews: number, alertMessage: null, histogramData: *, facetSelected: {}, liveViewUpdateFrequency: number, isFetching: boolean, facetdata: [], filterText: string, backupDefault: {}, endedTo: number, numViews: number, filterSelected: {}, backupMarked: {}, activeNavigators: [string, string], listdata: *, application: [], loadingListData: boolean, toScrollId: string, choosedApplication: string, intermediateEndTime: *, intermediateStartTime: *, endTime: *, activeFields: [string, string, string, string]}}
 */
export function transformReduxStateToOldState(reduxState) {
  return {
    startTime: selectStartTime(reduxState),
    endTime: selectEndTime(reduxState),
    histogramData: selectHistogramData(reduxState),
    listdata: selectListData(reduxState),
    searchText: selectSearchText(reduxState),
    intermediateStartTime: selectIntermediateStartTime(reduxState),
    intermediateEndTime: selectIntermediateEndTime(reduxState),
    facetdata: selectFacetData(reduxState),
    facetSelected: selectSelectedFacetData(reduxState), // hightlighted fields in the facet domain
    filterSelected: selectFilterFacetData(reduxState), // chosed filters
    filterText: selectFilterText(reduxState),
    numFound: selectTotalFound(reduxState),
    facetStartLimit: selectFacetStartLimit(reduxState),
    allNavigators: selectAllNavigators(reduxState),
    activeNavigators: selectActiveNavigators(reduxState),
    allFields: selectAllFields(reduxState),
    activeFields: selectActiveFields(reduxState),
    loadingListData: selectListIsLoading(reduxState),
    toScrollId: selectListToScrollId(reduxState),
    isFetching: false,
    views: selectViews(reduxState),
    numViews: selectNumViews(reduxState),
    numPagesForViews: selectNumPagesForViews(reduxState), // -1 indicates error
    justSwitched: false,
    markedRows: selectListMarkedRows(reduxState),
    endedTo: 1000,
    application: selectAllApplications(reduxState),
    choosedApplication: selectSelectedApplication(reduxState),
    backupMarked: {},
    backupDefault: {},
    currentAbortControllerFullFetch: null,
    currentAbortControllerHistogram: null,
    markedOnly: selectListMarkedOnly(reduxState),
    sortUp: selectListSortUp(reduxState),
    liveViewActive: selectLiveViewActive(reduxState),
    liveViewUpdateFrequency: selectLiveViewUpdateFrequency(reduxState),
  };
}
