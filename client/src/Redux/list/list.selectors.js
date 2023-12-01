import { createSelector } from 'reselect';
import { getListOfTruthyProps } from '../../utils/getListOfTruthyProps';

export const selectListData = (state) => state.list.data;
export const selectListMarkedOnly = (state) => state.list.markedOnly;
export const selectListMarkedRows = (state) => state.list.markedRows;
export const selectListSortUp = (state) => state.list.sortUp;
export const selectListIsLoading = (state) => state.list.loading;
export const selectListToScrollId = (state) => state.list.toScrollId;

export const selectAllMarkedRowIdsAsList = (state) => {
  return getListOfTruthyProps(selectListMarkedRows(state));
};

export const selectIsAnyRowMarked = (state) => {
  return selectAllMarkedRowIdsAsList(state)?.length || false;
};

export const selectListDataInSequence = createSelector(selectListData, selectListSortUp, (list, isSortUp) => {
  return isSortUp ? list : [...list].reverse();
});

export const selectActualListData = createSelector(
  selectListDataInSequence,
  selectListMarkedOnly,
  selectListMarkedRows,
  (list, isMarkedOnly, markedRows) => {
    const markedList = list.filter((row) => !!markedRows[row.id]);
    return isMarkedOnly ? markedList : list;
  }
);

export const selectRecentlyFetchedDataLength = (state) => state.list.recentlyFetchedData?.length;
export const selectUnreadData = (state) => state.list.unreadData;
export const selectColumnWidths = (state) => state.list.columnWidths;

// select first item in list
export const selectNewestListItem = (state) => {
  const list = selectListData(state);
  return list[0];
};

// select last item in list
export const selectOldestListItem = (state) => {
  const list = selectListData(state);
  return list[list.length - 1];
};

export const selectLastRequestType = (state) => state.list.lastRequestType;
