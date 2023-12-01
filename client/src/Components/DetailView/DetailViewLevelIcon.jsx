import React from 'react';

//import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
//import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
//import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import LevelBadge from '../Shared/LevelBadge';

/**
 * Renders a <DetailViewLevelIcon /> component.
 * @param {object} props - the components props
 * @param {boolean} props.isValidDocument - indicates if the current document is valid
 * @param {object} props.document - the current log entry
 */
function DetailViewLevelIcon(props) {
  const { isValidDocument, document } = props;

  if (!isValidDocument) {
    return null;
  }

  return (
    <div className="level-icon-bg">
      <LevelBadge level={document.level} />
    </div>
  );

  /*const level = document.level[0];
  if (level === 'ERROR') {
    return (
      <div className="level-icon-bg error">
        <ErrorOutlineIcon />
      </div>
    );
  } else if (level === 'INFO') {
    return (
      <div className="level-icon-bg info">
        <InfoOutlinedIcon />
      </div>
    );
  } else if (level === 'WARN') {
    return (
      <div className="level-icon-bg warn">
        <WarningRoundedIcon />
      </div>
    );
  } else if (level === 'DEBUG') {
    return (
      <div className="level-icon-bg debug">
        <BugReportOutlinedIcon />
      </div>
    );
  }*/
}

export default DetailViewLevelIcon;
