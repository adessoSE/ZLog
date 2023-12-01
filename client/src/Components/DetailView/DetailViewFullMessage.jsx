import React from 'react';

/**
 * Renders a <DetailViewFullMessage /> component.
 * @param {object} props - the components props
 * @param {string} props.message - the message
 */
function DetailViewFullMessage(props) {
  const { message } = props;
  const lines = message.split('\n');
  return lines.map((line, index) => {
    return (
      <span key={index} className="message-line">
        {line}
      </span>
    );
  });
}

export default DetailViewFullMessage;
