export function buildQueryForApplicationChoosed(choosedApplication) {
  if (choosedApplication === 'Alle Systeme') {
    return '';
  }

  return 'fq=application:' + choosedApplication;
}

/**
 *
 * @param {String} chosenApplication
 * @returns Filter object or null if 'Alle Systeme'
 */
export function getApplicationFilter(chosenApplication) {
  if (chosenApplication === 'Alle Systeme') {
    return null;
  }
  return { key: 'application', values: [chosenApplication], negated: false };
}
