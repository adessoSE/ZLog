import React from 'react';
import DetailViewLevelIcon from './DetailViewLevelIcon';
import DetailViewMessageShort from './DetailViewMessageShort';

/**
 * Renders a <DetailViewHeader /> component.
 * @param {object} props - the components props
 * @param {boolean} props.isValidDocument - indicates if the current document is valid
 * @param {object} props.document - the current log entry
 * @param {boolean} props.isFetching - indicates if fetching currently takes place
 */
function DetailViewHeader(props) {
  const { isValidDocument, document, isFetching } = props;

  return (
    <div id="header">
      <DetailViewLevelIcon isValidDocument={isValidDocument} document={document} />
      <DetailViewMessageShort isValidDocument={isValidDocument} document={document} isFetching={isFetching} />
    </div>
  );
}

export default DetailViewHeader;
