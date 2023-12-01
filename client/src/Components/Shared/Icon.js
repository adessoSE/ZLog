import React from 'react';
import PropTypes from 'prop-types';

/**
 * wrapper for fontawesome icons
 * @returns {JSX.Element}
 * @constructor
 */
export default function Icon(props) {
  const { type, spin = false, color = 'inherit', style } = props;

  const additionalClasses = [];

  if (spin) {
    additionalClasses.push('fa-spin');
  }

  return (
    <span style={{ color, ...style }}>
      <i className={`fa fa-${type} ${additionalClasses.join(' ')}`} />
    </span>
  );
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  spin: PropTypes.bool,
  color: PropTypes.string,
};
