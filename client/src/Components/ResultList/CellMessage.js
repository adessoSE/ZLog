import React, { useEffect, useRef, useState } from 'react';

const initialMaxHeight = 22;
const cellPadding = 12;

export default function CellMessage({ data, setSize, rowId, rowIndex, isScrolling, isExpanded }) {
  const [expanded, setExpanded] = useState(isExpanded);

  const [showExpandButton, setShowExpandButton] = useState(false);
  const messageContainer = useRef();
  const cellContainer = useRef();

  useEffect(() => {
    const elm = cellContainer.current;
    const hasOverflowingText = elm.offsetHeight < elm.scrollHeight || elm.offsetWidth < elm.scrollWidth;

    setShowExpandButton(hasOverflowingText || expanded);
    // eslint-disable-next-line
  }, []);

  /*useEffect(() => {
    if (messageContainer.current) {
      const size = expanded ? Math.max(messageContainer.current.clientHeight + cellPadding, 34) : null;
      setSize(rowId, rowIndex, size, true);
    }
    // eslint-disable-next-line
  }, [expanded]);*/

  const toggleExpanded = () => {
    setExpanded((prev) => {
      if (messageContainer.current) {
        const size = !prev ? Math.max(messageContainer.current.clientHeight + cellPadding, 34) : null;
        setSize(rowId, rowIndex, size);
      }
      return !prev;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          height: expanded ? 'inherit' : initialMaxHeight,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 'auto',
          width: '1px',
        }}
        ref={cellContainer}
      >
        <div
          ref={messageContainer}
          style={{
            whiteSpace: 'pre-wrap',
            paddingRight: '20px',
            height: 'auto',
          }}
        >
          {data}
        </div>
      </div>
      <ExpandButton isScrolling={isScrolling} onClick={toggleExpanded} expanded={expanded} visible={showExpandButton} />
    </div>
  );
}

function ExpandButton({ isScrolling, visible, onClick, expanded }) {
  if (isScrolling || !visible) {
    return <div style={{ width: 26, height: 26 }} />;
  }
  return (
    <button
      className={'btn btn-micro btn-light'}
      style={{ width: 26 }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <i className={'fa ' + (expanded ? 'fa-minus' : 'fa-plus')} />
    </button>
  );
}
