import moment from 'moment';

/**
 * translates solr time data into internal object used for the histogram
 * @param {*} solr solr response
 */
export function prepareDataForHistogram(solr) {
  let facets = solr['facetRanges'];

  if (facets['name'] !== 'time' || facets.elements === undefined || facets.elements.length <= 0) {
    return [];
  } else {
    let solr_counts = facets.elements;
    let data = [];
    for (var i = 0; i < solr_counts.length; i++) {
      data.push({
        time: moment(solr_counts[i].value).local().format(),
        value: solr_counts[i].count,
      });
    }
    return data;
  }
}
