/* eslint-disable react/display-name */
import React from 'react';

/**
 * Renders a <DetailViewCommentField /> component.
 * @param {object} props - the components props
 * @param {string} props.id - the field's id
 * @param {string} props.text - the field's defaultValue
 * @param {string} props.placeholder - the field's placeholder text
 * @param {boolean} props.isDisabled - the field's disabled state (true => button is set to disabled)
 */
const DetailViewCommentField = React.forwardRef((props, ref) => {
  const { id, text, placeholder, isDisabled } = props;

  return (
    <textarea
      className="form-control h-100"
      placeholder={placeholder}
      name="comment-text"
      id={id}
      cols="30"
      rows="1"
      defaultValue={text}
      disabled={isDisabled}
      ref={ref}
    ></textarea>
  );
});

export default DetailViewCommentField;
