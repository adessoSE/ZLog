import React from 'react';

/**
 *
 * @param {number} number
 * @param {string} locale
 * @param otherProps - e.g. style etc...
 * @returns {JSX.Element} - a formatted number wrapped in a <span>
 */
export default function FormatNumber({ number, locale, ...otherProps }) {
  const result = Number(number).toLocaleString(locale);

  return <span {...otherProps}>{result}</span>;
}
