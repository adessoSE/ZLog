import React from 'react';

export default function ProgressBar(props) {
  const { label, width, minWidthForLabel = 30 } = props;

  const isGreaterThanMinWidth = width >= minWidthForLabel;

  return (
    <div className={'progress'}>
      <div
        className="progress-bar p-1"
        role="progressbar"
        style={{ width: `${width}%` }}
        aria-valuenow={width}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {isGreaterThanMinWidth && label}
      </div>
      {!isGreaterThanMinWidth && <div className="progress-bar bg-transparent text-dark p-1">{label}</div>}
    </div>
  );
}
