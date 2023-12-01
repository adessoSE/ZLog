import React from 'react';

/**
 * Renders a <DetailViewMessageShort /> component.
 * @param {object} props - the components props
 * @param {boolean} props.isValidDocument - indicates if the current document is valid
 * @param {object} props.document - the current log entry
 * @param {boolean} props.isFetching - indicates if fetching currently takes place
 */
function DetailViewMessageShort(props) {
  const { isValidDocument, document, isFetching } = props;
  const maxTitleLength = 70;

  if (!isValidDocument && !isFetching) {
    return <h5>Error</h5>;
  } else if (isFetching) {
    return <h5>Loading...</h5>;
  }

  let message = document.message;
  if (message.length > maxTitleLength) {
    message = message.substring(0, maxTitleLength - 3) + '...';
  }

  return <div className="title-short">{message}</div>;
}

export default DetailViewMessageShort;
