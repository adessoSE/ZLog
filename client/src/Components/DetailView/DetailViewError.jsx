import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

/**
 * Renders a <DetailViewError /> component.
 * @param {object} props - the components props
 * @param {string} props.documentID - the document's id
 */
function DetailViewError(props) {
  const { documentID } = props;

  return (
    <div className="error-container">
      <div id="error-icon">
        <span className="error">
          <ErrorOutlineIcon color="error" />
        </span>
      </div>
      <div id="error-message">
        <span className="error">Es konnte kein Logeintrag mit der ID</span>
        <span className="error">
          <strong>{documentID}</strong>
        </span>
        <span className="error">gefunden werden.</span>
      </div>
    </div>
  );
}

export default DetailViewError;
