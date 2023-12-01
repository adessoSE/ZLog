import React from 'react';
import Icon from '../Shared/Icon';

export default function CellActions(props) {
  const { displayDetails, isMarked, isSelected } = props;
  return (
    <div style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'right', color: isSelected ? 'inherit' : '#28a745' }}>
      {isMarked && (
        <span style={{ padding: '0.25rem 0.5rem' }}>
          <Icon type={'thumbtack'} />
        </span>
      )}
      <button className={'btn btn-light btn-micro'} onClick={displayDetails}>
        <Icon type={'search'} />
      </button>
    </div>
  );
}
