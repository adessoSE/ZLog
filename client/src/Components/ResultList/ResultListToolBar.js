import React from 'react';
import Button from 'reactstrap/es/Button';
import Icon from '../Shared/Icon';
import { getListOfTruthyProps } from '../../utils/getListOfTruthyProps';
import FormatNumber from '../Shared/FormatNumber';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { Badge, ButtonGroup } from 'reactstrap';

export default function ResultListToolBar(props) {
  const {
    selectedItems,
    setSelectedItems,
    toggleMarkedRows,
    isFetchingNewData,
    isFetchingOldData,
    listData,
    loadNewerItems,
    scrollToNewest,
    scrollToOldest,
    activeFields,
    unreadData,
    selectAll,
    isScrolledToNewest,
  } = props;

  const selectedCount = getListOfTruthyProps(selectedItems).length;
  const isEmptySelection = !selectedCount;
  const isFetching = isFetchingNewData || isFetchingOldData;

  const itemCount = listData.length;

  const getTextToCopy = () => {
    const selected = listData
      .filter((element) => selectedItems[element.id])
      .map((element) => activeFields.map((field) => element[field]))
      .map((element) => element.filter((element) => element).join(' '))
      .join('\n');
    return selected;
  };

  const onCopy = () => {
    toast('Copied to Clipboard', { type: 'info', position: 'bottom-center' });
  };

  const unreadDataLength = Object.keys(unreadData).length;

  return (
    <div className={'result-list-toolbar'} style={{ marginBottom: 8, marginRight: 8 }}>
      <div>
        <ButtonGroup style={{ marginRight: 8 }}>
          <Button size={'sm'} color={'light'} onClick={() => setSelectedItems({})} disabled={isEmptySelection}>
            Clear Selection
          </Button>
          <Button size={'sm'} color={'light'} onClick={selectAll}>
            Select All
          </Button>
        </ButtonGroup>
        <ButtonGroup style={{ marginRight: 8 }}>
          <Button size={'sm'} color={'light'} onClick={scrollToNewest}>
            Show Newest
          </Button>
          <Button size={'sm'} color={'light'} onClick={scrollToOldest}>
            Show Oldest
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            size={'sm'}
            color={'light'}
            onClick={() => toggleMarkedRows(getListOfTruthyProps(selectedItems))}
            disabled={isEmptySelection}
          >
            <Icon type={'thumbtack'} /> Toggle Marks
          </Button>
          <CopyToClipboard onCopy={onCopy} text={getTextToCopy()}>
            <Button size={'sm'} color={'light'} disabled={isEmptySelection}>
              <Icon type={'copy'} /> Copy to clipboard
            </Button>
          </CopyToClipboard>
        </ButtonGroup>
        {!!selectedCount && (
          <span style={{ padding: '0.25rem 0.5rem' }}>
            <FormatNumber number={selectedCount} /> Selected
          </span>
        )}
      </div>
      <div>
        {isFetching && <Icon type={'spinner'} spin />}
        <span style={{ padding: '0.25rem 0.5rem' }}>
          Showing: <FormatNumber number={itemCount} /> Items
        </span>
        {unreadDataLength > 0 && !isScrolledToNewest && (
          <Badge color="primary" style={{ fontSize: '0.75rem', marginRight: '0.5rem' }} onClick={scrollToNewest}>
            {unreadDataLength} New
          </Badge>
        )}
        <Button size={'sm'} color={'light'} onClick={loadNewerItems}>
          Refresh
        </Button>
        {process.env.REACT_APP_ENVIRONMENT !== 'production'}
      </div>
    </div>
  );
}
