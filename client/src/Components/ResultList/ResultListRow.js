import React from 'react';
import Cell from './ResultListCell';

export default function ResultListRow(props) {
  const { row, rowId, style, handleClick, isSelected, level, handleDoubleClick, ...otherProps } = props;

  return (
    <div
      {...row.getRowProps({
        style,
      })}
      className={'tr ' + level + (isSelected ? ' active' : '')}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {row.cells.map((cell, idx) => {
        return (
          <Cell
            cellProps={cell.getCellProps()}
            columnName={cell.column.id}
            key={idx}
            rowId={rowId}
            isSelected={isSelected}
            {...otherProps}
          >
            {cell.render('Cell')}
          </Cell>
        );
      })}
    </div>
  );
}
