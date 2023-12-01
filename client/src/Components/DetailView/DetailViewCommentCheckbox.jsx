import React from 'react';

/**
 * Renders a <DetailViewCommentCheckbox /> component.
 * @param {object} props - the components props
 * @param {boolean} props.isChecked - the checkbox' 'defaultChecked' state
 * @param {string} props.conditionKey - the key of the checkbox condition
 * @param {string} props.conditionValue - the value of the checkbox condition
 * @param {function} props.addSelectedCondition - adds a condition to selectedConditions
 * @param {function} props.removeSelectedCondition - removes a condition from selectedConditions
 */
function DetailViewCommentCheckbox(props) {
  const { isChecked, conditionKey, conditionValue, addSelectedCondition, removeSelectedCondition } = props;

  /**
   * Handles the checkbox' onChange event.
   * @param {object} e - the onChange event
   */
  const handleChange = (e) => {
    e.target.checked
      ? addSelectedCondition(conditionKey, conditionValue)
      : removeSelectedCondition(conditionKey, conditionValue);
  };

  return (
    <td>
      <div className="checkbox">
        <input type="checkbox" defaultChecked={isChecked} onChange={handleChange} />
      </div>
    </td>
  );
}

export default DetailViewCommentCheckbox;
