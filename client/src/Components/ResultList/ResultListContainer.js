import ResultList from './ResultList';
import { connect } from 'react-redux';
import { REQ_LIST_AND_FACETS, REQ_LIST_AND_FACETS_NEW, REQ_LIST_AND_FACETS_OLD } from '../../utils/requestTypes';
import * as Selectors from '../../Redux/selectors';
import * as Actions from '../../Redux/actions';

const mapStateToProps = (state) => {
  return {
    listData: Selectors.selectActualListData(state),
    reversed: !Selectors.selectListSortUp(state),
    isFetchingInitialData: Selectors.selectIsOneOfRequestTypesActive(state, [REQ_LIST_AND_FACETS]),
    isFetchingNewData: Selectors.selectIsOneOfRequestTypesActive(state, [REQ_LIST_AND_FACETS_NEW]),
    isFetchingOldData: Selectors.selectIsOneOfRequestTypesActive(state, [REQ_LIST_AND_FACETS_OLD]),
    totalCount: Selectors.selectTotalFound(state),
    activeFields: Selectors.selectActiveFields(state),
    allMarkedRows: Selectors.selectListMarkedRows(state),
    isMarkedOnly: Selectors.selectListMarkedOnly(state),
    recentlyFetchedDataLength: Selectors.selectRecentlyFetchedDataLength(state),
    columnWidths: Selectors.selectColumnWidths(state),
    lastRequestType: Selectors.selectLastRequestType(state),
    totalSelectedCount: Selectors.selectTotalSelectedCount(state),
    unreadData: Selectors.selectUnreadData(state),
    filterData: Selectors.selectFilterFacetDataGroupedByType(state),
    isFacetTypeNegated: (type) => Selectors.selectIsFacetTypeNegated(state, type),
  };
};
const mapDispatchToProps = {
  fetchOlderLogsAction: Actions.fetchOlderLogsAction,
  fetchNewerLogsAction: Actions.fetchNewerLogsAction,
  fetchHistogramData: Actions.fetchHistogramData,
  toggleMarkedRows: Actions.toggleMarkedRows,
  setSelectedFacetData: Actions.setSelectedFacetData,
  mergeFacetFilter: Actions.mergeFacetFilter,
  mergeNegatedFilterType: Actions.mergeNegatedFilterType,
  changeStartTime: Actions.changeStartTime,
  changeEndTime: Actions.changeEndTime,
  cancelAllRequests: Actions.requestCancelAllAction,
  updateColumnWidths: Actions.updateColumnWidths,
  setLiveViewPaused: Actions.setLiveViewPaused,
  resetUnreadData: Actions.resetUnreadData,
  showDetailViewForDocument: Actions.showDetailViewForDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultList);
