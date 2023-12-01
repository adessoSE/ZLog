/**
 * facets: [{name: level, elements: [{value:INFO, count:6}, {value:DEBUG, count:12}]}],
 */
export function transformFacetDataToList(facetData, activeNavigators = []) {
  const result = [];

  // eslint-disable-next-line no-unused-vars
  for (var i = 0; i < facetData.length; i++) {
    const facet = facetData[i];
    const type = facet['name'];
    if (activeNavigators.includes(type)) {
      const chunks = facet['elements'];
      const allPerType = chunks.map((el) => {
        const count = el['count'];
        const subtype = el['value'];
        return {
          type,
          count,
          subtype,
          id: type + ':' + subtype,
        };
      });
      result.push(...allPerType);
    }
  }

  return result;
}

/**
 * translates solr facet data into internal object used for facets data needed in other components
 * @param {*} solr solr response
 * @param {string[]} activeNavigators
 */
export function prepareDataForFacetDomain(solr, activeNavigators) {
  let facets = solr['facet_counts']['facet_fields'];
  let data = {};

  for (var i = 0; i < activeNavigators.length; i++) {
    var fieldName = activeNavigators[i];

    var solr_result = facets[fieldName];
    //console.log("solrResult print")
    //console.log(solr_result)
    var local_data = {};
    if (solr_result !== undefined) {
      local_data = transformFacetAndCounts(solr_result);
      data[fieldName] = local_data;
    }
  }
  return data;
  //return data;
}

// translate facet value, count into value:count for each value returned by solr
function transformFacetAndCounts(solr_result) {
  var local_data = {};
  for (var j = 0; j < solr_result.length; j += 2) {
    local_data[solr_result[j]] = solr_result[j + 1];
  }
  return local_data;
}
