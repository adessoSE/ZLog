/**
 * translates solr fields data into internal json object used for fields, data needed in other components
 * @param {*} solr solr response
 */
export function prepareAllFields(solr_fields) {
  let data = [];

  // ommit _root_ and _version_ field names
  for (var i = 0; i < solr_fields.length; i++) {
    if (
      // !solr_fields[i].includes('_root_') &&
      // !solr_fields[i].includes('_version_') &&
      !(solr_fields[i] === 'counterId')
    ) {
      data.push(solr_fields[i]);
    }
  }

  return data;
}

/**
 * translates solr navigator data into internal json object used for navigators, data needed in other components
 * @param {*} solr solr response
 */
export function prepareAllNavigators(solr_fields) {
  let data = [];

  // ommit _root_ and _version_ field names
  for (var i = 0; i < solr_fields.length; i++) {
    if (
      // !solr_fields[i].includes('_root_') &&
      // !solr_fields[i].includes('_version_') &&
      // !solr_fields[i].includes('Message') &&
      !(solr_fields[i] === 'message') &&
      // !solr_fields[i].includes('text') &&
      // !solr_fields[i].includes('Text') &&
      !(solr_fields[i] === 'time')
      // !solr_fields[i].includes('SourceLine') &&
      // !(solr_fields[i] === 'counterId')
    ) {
      data.push(solr_fields[i]);
    }
  }
  return data;
}
