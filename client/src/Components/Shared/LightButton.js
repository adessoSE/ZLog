import React from 'react';
import PropTypes from 'prop-types';
import '../../SCSS/MainBody.scss';

export default function LightButton(props) {
  const { onClick, children } = props;

  return (
    <div onClick={onClick} className="button-light p-2">
      {children}
    </div>
  );
}

LightButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
