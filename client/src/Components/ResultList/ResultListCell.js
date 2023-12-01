import React from 'react';
import CellMessage from './CellMessage';
import CellLevel from './CellLevel';
import CellDefault from './CellDefault';
import CellActions from './CellActions';
import { ContextMenuTrigger } from 'react-contextmenu';

export default function Cell(props) {
  const { cellProps, children, columnName, rowId, ...otherProps } = props;

  const Value = getValueComponent(columnName);

  //const contextMenuID = `col:${columnName}_row:${row}`;

  return (
    <div className={'td'} {...cellProps}>
      <ContextMenuTrigger id="context-menu-cell" columnName={columnName} rowId={rowId} collect={(props) => props}>
        <Value data={children} rowId={rowId} {...otherProps} />
      </ContextMenuTrigger>
    </div>
  );
}

function getValueComponent(columnName) {
  switch (columnName.toLowerCase()) {
    case 'message':
      return CellMessage;
    case 'level':
      return CellLevel;
    case 'actions':
      return CellActions;
    default:
      return CellDefault;
  }
}
