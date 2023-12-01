import React from 'react';
import LoadingOverlay from 'react-loading-overlay';

export default function DefaultLoadingOverlay(props) {
  return (
    <LoadingOverlay
      {...props}
      spinner
      fadeSpeed={100}
      styles={{
        spinner: (base) => ({
          ...base,
          width: '100px',
          '& svg circle': {
            stroke: 'rgba(18, 58, 188, 0.5)',
          },
        }),
        overlay: (base) => ({
          ...base,
          background: 'rgba(255, 255, 255, 0.5)',
        }),
        content: (base) => ({
          ...base,
          color: 'black',
        }),
      }}
    >
      {props.children}
    </LoadingOverlay>
  );
}
