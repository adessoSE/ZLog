/**
 * adds an error message to error object, use in jquery ajax setups at options.error
 *
 * @param customMessage
 * @returns {function(*): void}
 */

export const makeOnError = (customMessage) => (err) => {
  err.message = customMessage || err.message || 'Something went wrong :(';
};
