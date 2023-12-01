import React from 'react';
import moment from 'moment';
import DetailViewCommentCheckbox from './DetailViewCommentCheckbox';
import DetailViewFullMessage from './DetailViewFullMessage';

/**
 * Renders a <DetailViewDetails /> component.
 * @param {object} props - the components props
 * @param {object} props.document - the current log entry
 * @param {boolean} props.isCommentBeingAdded - indicates if a comment is currently being added
 * @param {boolean} props.isCommentBeingEdited - indicates if a comment is currently being edited
 * @param {function} props.checkIfConditionIsInActiveCommentConditions - checks if a conditions is contained in the active comment's condition
 * @param {function} props.addSelectedCondition - adds a condition to selectedConditions
 * @param {function} props.removeSelectedCondition - removes a condition from selectedConditions
 */
function DetailViewDetails(props) {
  const {
    document,
    isCommentBeingAdded,
    isCommentBeingEdited,
    checkIfConditionIsInActiveCommentConditions,
    addSelectedCondition,
    removeSelectedCondition,
  } = props;

  const excludeKeys = ['fullMessage', 'message'];

  const formatTime = (value) => {
    const m = moment(value);
    if (m.isValid()) {
      return m.format('DD.MM.YYYY HH:mm:ss.SSS');
    } else {
      return value;
    }
  };

  const checkIfKeyIsId = (key) => {
    if (key === 'id') {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="detail-container mb-3">
      <div className="table-container">
        <table className="detail-table">
          <tbody>
            {Object.keys(document).map((key, index) => {
              if (excludeKeys.includes(key)) {
                return null;
              }
              let value = Array.isArray(document[key]) ? document[key].join(', ') : document[key];
              return (
                <tr key={index} className="detail-entry">
                  {(isCommentBeingAdded || isCommentBeingEdited) && (
                    <DetailViewCommentCheckbox
                      isChecked={isCommentBeingEdited ? checkIfConditionIsInActiveCommentConditions(key, value) : checkIfKeyIsId(key)}
                      conditionKey={key}
                      conditionValue={value}
                      addSelectedCondition={addSelectedCondition}
                      removeSelectedCondition={removeSelectedCondition}
                    />
                  )}
                  <td className="title">{key}</td>
                  <td className="content">{key === 'time' ? formatTime(value) : value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="full-message-container">
        <pre className="full-message-text">
          {/*console.log(document.message)*/}
          <DetailViewFullMessage message={document.message} />
        </pre>
      </div>
    </div>
  );
}

export default DetailViewDetails;
