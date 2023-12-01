/**
 * Transforms date from DD.MM.yyyy HH:mm:ss.SSS to YYYY-MM-DDTHH:mm:ss.SSS
 */
export function formatDate(input) {
  const split = input.split(' ');
  const date = split[0];
  const time = split[1];
  const splitDate = date.split('.').reverse();
  splitDate.splice(1, 0, '-');
  splitDate.splice(3, 0, '-');

  return splitDate.join('') + 'T' + time;
}
