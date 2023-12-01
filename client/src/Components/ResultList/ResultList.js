import React, { useEffect, useState, useCallback } from 'react';
import { useFlexLayout, useResizeColumns, useTable } from 'react-table';
import '../../SCSS/ResultList.scss';
import { VariableSizeList as List } from 'react-window';

import Row from './ResultListRow';
import InfiniteLoader from 'react-window-infinite-loader';
import Icon from '../Shared/Icon';
import AutoSizer from 'react-virtualized-auto-sizer';
import UnwrappingLoadingOverlay from '../../utils/UnwrappingLoadingOverlay';
import ResultListToolBar from './ResultListToolBar';
import { REQ_LIST_AND_FACETS, REQ_LIST_AND_FACETS_NEW, REQ_LIST_AND_FACETS_OLD, REQ_RESET_GUI } from '../../utils/requestTypes';
import { deselect } from '../../utils/deselect';
import FormatNumber from '../Shared/FormatNumber';
import DetailView from '../DetailView/DetailView';
import { v1 as uuidv1 } from 'uuid';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { getListOfTruthyProps } from '../../utils/getListOfTruthyProps';

import moment from 'moment';

const DEFAULT_LINE_HEIGHT = 34;
const WARNING_LIMIT = 20000;
const OLDEST = 'oldest';
const NEWEST = 'newest';

export default function Table(props) {
  const {
    reversed,
    totalCount,
    listData,
    isFetchingInitialData,
    isFetchingNewData,
    isFetchingOldData,
    activeFields,
    fetchOlderLogsAction,
    fetchNewerLogsAction,
    lastRequestType,
    allMarkedRows,
    isMarkedOnly,
    toggleMarkedRows,
    mergeFacetFilter,
    mergeNegatedFilterType,
    isFacetTypeNegated,
    changeStartTime,
    changeEndTime,
    recentlyFetchedDataLength,
    updateColumnWidths,
    columnWidths,
    cancelAllRequests,
    totalSelectedCount,
    unreadData,
    resetUnreadData,
    showDetailViewForDocument,
    filterData,
  } = props;

  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState({});
  const [suppressFetchingNewerItems, setSuppressFetchingNewerItems] = useState(true);
  const [scrolledTo, setScrolledTo] = useState('');
  const [lastClickedIndex, setLastClickedIndex] = useState(-1);
  const listRef = React.createRef();
  const listContainer = React.createRef();

  const scrollToItem = (index, align = 'center') => {
    listRef.current && listRef.current.scrollToItem(index, align);
  };

  const scrollTo = (offset) => {
    listRef.current && listRef.current.scrollTo(offset);
  };

  const resetListAfter = (index) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  const scrollToNewest = () => {
    resetUnreadData();
    reversed ? scrollToItem(itemCount, 'end') : scrollToItem(0);
  };
  const scrollToOldest = () => {
    !reversed ? scrollToItem(itemCount, 'end') : scrollToItem(0);
  };

  const sizeMap = React.useRef({});

  const setSize = useCallback(
    (id, index, size, bypassReset) => {
      if (!bypassReset && listRef.current) {
        listRef.current.resetAfterIndex(index);
      }
      sizeMap.current = { ...sizeMap.current, [id]: size };
    }, // eslint-disable-next-line
    [listRef, listData, reversed]
  );

  const getSize = useCallback(
    (index) => {
      try {
        const indexOffset = !isMarkedOnly && reversed ? 1 : 0;
        const id = listData[index - indexOffset] ? listData[index - indexOffset].id : 'loading-indicator';
        return sizeMap.current[id] || DEFAULT_LINE_HEIGHT;
      } catch (err) {
        return DEFAULT_LINE_HEIGHT;
      }
    },
    [sizeMap, listData, reversed, isMarkedOnly]
  );

  const getIsExpanded = useCallback(
    (index) => {
      return getSize(index) > DEFAULT_LINE_HEIGHT;
    },
    [getSize]
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 800,
    }),
    []
  );

  const columns = React.useMemo(() => {
    // create column object by mapping over active fields
    const result = activeFields.map((field) => {
      // looking for persisted column width, otherwise default to 100
      let width = columnWidths[field] || 100;
      // message column should default to 400
      if (field === 'message' && !columnWidths[field]) {
        width = 400;
      }
      return { header: field.toUpperCase(), accessor: field, width };
    });
    // add extra column for action buttons (exp. detail view)
    result.push({ header: '', accessor: 'actions', width: 60, disableResizing: true });

    return result; // eslint-disable-next-line
  }, [activeFields]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { columnResizing },
  } = useTable(
    {
      columns,
      data: listData,
      defaultColumn,
    },
    useFlexLayout,
    useResizeColumns
  );

  const selectList = (list, keepPrevious = true) => {
    const selection = list
      .map((item) => item.id)
      .reduce((acc, next) => {
        return {
          ...acc,
          [next]: true,
        };
      }, {});

    if (keepPrevious) {
      setSelected((prev) => ({
        ...prev,
        ...selection,
      }));
    } else {
      setSelected(selection);
    }
  };

  const handleRowClick = (id, index) => (event) => {
    deselect();
    if (event.shiftKey && lastClickedIndex) {
      let start = lastClickedIndex;
      let end = index + 1;
      if (start > end - 1) {
        const temp = end;
        end = start + 1;
        start = temp - 1;
      }
      const subList = listData.slice(start, end);
      selectList(subList, false);
    } else if (event.ctrlKey) {
      toggleSelection(id);
    } else {
      setSelected({ [id]: true });
      setLastClickedIndex(index);
    }
  };

  const handleRowDoubleClick = (id) => () => {
    showDetailViewForDocument(id);
  };

  const toggleSelection = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allRowsLoaded =
    listData.length >= totalCount || isMarkedOnly || (totalSelectedCount && listData.length >= totalSelectedCount);

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = allRowsLoaded || isMarkedOnly ? listData.length : listData.length + 1;

  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once or if markedOnly mode active.
  const loadNewerItems = isFetchingNewData || isMarkedOnly ? () => {} : fetchNewerLogsAction;

  // Only load 1 page of listData at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadOlderItems = isFetchingInitialData || isFetchingOldData || allRowsLoaded ? () => {} : fetchOlderLogsAction;

  // Every row is loaded except for our loading indicator rows.
  const isItemLoaded = useCallback(
    (index) => {
      let r = false;
      if (allRowsLoaded || isMarkedOnly) {
        r = true;
      } else {
        if (reversed) {
          r = index > 0;
        } else {
          r = index < listData.length;
        }
      }
      return r;
    }, // eslint-disable-next-line
    [allRowsLoaded, reversed, listData, isMarkedOnly]
  );

  // listen to changes of listData and calculate the scroll position
  useEffect(() => {
    if (lastRequestType !== REQ_LIST_AND_FACETS) {
      setSuppressFetchingNewerItems(false);
      const newDataLength = recentlyFetchedDataLength;
      let newDataHeight = 0;

      if (lastRequestType === REQ_LIST_AND_FACETS_OLD) {
        newDataHeight = reversed ? newDataLength * DEFAULT_LINE_HEIGHT : 0;
      } else if (lastRequestType === REQ_LIST_AND_FACETS_NEW) {
        if (reversed) {
          if (scrolledTo === NEWEST) {
            newDataHeight = newDataLength * DEFAULT_LINE_HEIGHT;
          } else {
            newDataHeight = 0;
          }
        } else {
          if (scrolledTo === NEWEST) {
            newDataHeight = 0;
          } else {
            newDataHeight = newDataLength * DEFAULT_LINE_HEIGHT;
          }
        }
      }
      const actualOffset = offset + newDataHeight;

      scrollTo(actualOffset);
      resetListAfter(0);
    } else {
      setSuppressFetchingNewerItems(true);
      scrollToNewest();
    } // eslint-disable-next-line
  }, [listData, itemCount]);

  // listen to changes of lastRequestType
  useEffect(() => {
    if (lastRequestType === REQ_RESET_GUI){
      setSelected({});
    } // eslint-disable-next-line
  }, [lastRequestType]);

  // trigger fetches on scrolling to top/bottom
  useEffect(() => {
    if (scrolledTo === NEWEST) {
      if (suppressFetchingNewerItems) {
        setSuppressFetchingNewerItems(false);
        return;
      }
      loadNewerItems();
    } else if (scrolledTo === OLDEST) {
      loadOlderItems();
    }
    // eslint-disable-next-line
  }, [scrolledTo]);

  // Listen for column resizing
  useEffect(() => {
    if (columnResizing.isResizingColumn === null) {
      updateColumnWidths(columnResizing.columnWidths);
    }
  }, [columnResizing, updateColumnWidths]);

  const RenderRow = React.useCallback(
    ({ index, isScrolling, style = {} }) => {
      if (!isItemLoaded(index)) {
        return (
          <div
            className={'tr'}
            style={{
              ...style,
              textAlign: 'center',
              padding: '6px',
            }}
          >
            <Icon type={'spinner'} spin /> loading...
          </div>
        );
      }
      const rowIndex = reversed && !allRowsLoaded ? index - 1 : index;
      const row = rows[rowIndex];
      if (!row) {
        return null;
      }
      const rowId = row.original.id;
      const isSelected = !!selected[rowId];
      const isMarked = !!allMarkedRows[rowId];

      /*const _displayDetails = (event) => {
        event.stopPropagation();
        displayDetails(rowId);
      };*/
      const level = row.original.level ? row.original.level : 'none';
      prepareRow(row);
      return (
        <Row
          row={row}
          rowId={rowId}
          style={style}
          rowIndex={rowIndex}
          setSize={setSize}
          handleClick={handleRowClick(rowId, rowIndex)}
          handleDoubleClick={handleRowDoubleClick(rowId)}
          isSelected={isSelected}
          isMarked={isMarked}
          isScrolling={isScrolling}
          isExpanded={getIsExpanded(index)}
          displayDetails={() => showDetailViewForDocument(rowId)}
          level={level}
        />
      );
    },
    // eslint-disable-next-line
    [prepareRow, rows, setSize, isItemLoaded, /*reversed,*/ selected, allRowsLoaded, listData, isMarkedOnly]
  );

  const onItemsRenderedCustom = ({ visibleStartIndex, visibleStopIndex }) => {
    if (visibleStartIndex === 0) {
      setScrolledTo(reversed ? OLDEST : NEWEST);
    } else if (visibleStopIndex === itemCount - 1) {
      setScrolledTo(reversed ? NEWEST : OLDEST);
    } else {
      setScrolledTo('');
    }
    if (scrolledTo === NEWEST) {
      resetUnreadData();
    }
  };

  const onScroll = ({ scrollOffset }) => {
    setOffset(scrollOffset);
  };

  if (!listData.length && !isFetchingInitialData) {
    return (
      <div className="alert alert-info mr-3" role="alert">
        No list data found :(
      </div>
    );
  } else if (!activeFields.length) {
    return (
      <div className="alert alert-info mr-3" role="alert">
        Please select at least one active field.
      </div>
    );
  }

  const onShowSimilar = (data) => {
    if (
      !data.columnName.includes('message') &&
      !data.columnName.includes('time') &&
      listData[data.children.props.rowIndex][data.columnName] !== undefined &&
      !Object.keys(filterData).includes(data.columnName)
    ) {
      let filter = JSON.parse(
        '{"' + data.columnName + ':' + listData[data.children.props.rowIndex][data.columnName] + '": true}'
      );
      mergeFacetFilter(filter);
      const nowTime = moment();
      changeEndTime(nowTime.valueOf());
      changeStartTime(nowTime.subtract(2, 'minutes').valueOf());
    }
  };

  const onHideSimilar = (data) => {
    if (
      !data.columnName.includes('message') &&
      !data.columnName.includes('time') &&
      listData[data.children.props.rowIndex][data.columnName] !== undefined
    ) {
      let filter = JSON.parse(
        '{"' + data.columnName + ':' + listData[data.children.props.rowIndex][data.columnName] + '": true}'
      );
      if (!Object.keys(filterData).includes(data.columnName)) {
        mergeFacetFilter(filter);
      }

      mergeNegatedFilterType({
        [data.columnName]: !isFacetTypeNegated(data.columnName),
      });
    }
  };

  return (
    <div
      className="result-list-wrapper"
      style={{ position: 'relative', flex: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      <DetailView />

      <ResultListToolBar
        toggleMarkedRows={toggleMarkedRows}
        scrollToNewest={scrollToNewest}
        scrollToOldest={scrollToOldest}
        selectedItems={selected}
        setSelectedItems={setSelected}
        selectAll={() => selectList(listData)}
        loadNewerItems={loadNewerItems}
        isFetchingNewData={isFetchingNewData}
        isFetchingOldData={isFetchingOldData}
        listData={listData}
        activeFields={activeFields}
        reversed={reversed}
        unreadData={unreadData}
        isScrolledToNewest={scrolledTo === NEWEST}
      />

      {itemCount > WARNING_LIMIT && (
        <div className={'alert alert-warning alert-sm mr-3'}>
          You are currently viewing more than <FormatNumber number={WARNING_LIMIT} /> Items. Please consider to narrow
          down your selection.
        </div>
      )}

      <div {...getTableProps()} className="result-list-table">
        <div className={'thead'}>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr" key={uuidv1()}>
              {headerGroup.headers.map((column) => {
                const resizeProps = column.getResizerProps ? column.getResizerProps() : {};
                return (
                  <div {...column.getHeaderProps()} className="th" key={uuidv1()}>
                    {column.render('header')}
                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div {...resizeProps} className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadOlderItems}
          {...getTableBodyProps()}
        >
          {({ onItemsRendered, ref }) => (
            <div className={'tbody'}>
              <div style={{ height: '100%', width: '100%', position: 'relative' }} ref={listContainer}>
                <UnwrappingLoadingOverlay
                  active={isFetchingInitialData}
                  text={
                    <button className="btn btn-secondary" onClick={cancelAllRequests}>
                      Cancel
                    </button>
                  }
                />
                <AutoSizer>
                  {({ height, width }) => {
                    if (listData.length === 0) {
                      return null;
                    }
                    return (
                      <List
                        //ref={listRef}
                        ref={(list) => {
                          ref(list);
                          listRef.current = list;
                        }}
                        height={height}
                        itemData={listData}
                        itemKey={(index, data) => {
                          const item = data[index];
                          return item ? item.id : uuidv1();
                        }}
                        itemCount={itemCount}
                        width={width}
                        onItemsRendered={(...args) => {
                          onItemsRenderedCustom(...args);
                          onItemsRendered(...args);
                        }} //safe
                        itemSize={getSize}
                        style={{ overflowAnchor: 'none' }}
                        onScroll={onScroll} //safe
                        initialScrollOffset={reversed ? listData.length * DEFAULT_LINE_HEIGHT : 0} // safe
                        useIsScrolling
                      >
                        {RenderRow}
                      </List>
                    );
                  }}
                </AutoSizer>
              </div>
            </div>
          )}
        </InfiniteLoader>

        <ContextMenu id={'context-menu-cell'}>
          <MenuItem onClick={(_, data) => showDetailViewForDocument(data.rowId)}>Display details</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={(_, data) => toggleMarkedRows([data.rowId])}>Toggle mark</MenuItem>
          <MenuItem onClick={() => toggleMarkedRows(getListOfTruthyProps(selected))}>
            Toggle all selected marks
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={(_, data) => onShowSimilar(data)}>Show similar elements in last 2 minutes</MenuItem>
          <MenuItem onClick={(_, data) => onHideSimilar(data)}>Hide similar elements</MenuItem>
        </ContextMenu>
      </div>
    </div>
  );
}
