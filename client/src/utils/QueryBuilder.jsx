import $ from 'jquery';
import { getMarkedIds } from '../API/helper/buildQueryForMarkedRows';

import { config_env } from './Constants_env';

export default class QueryBuilder {
  ///select?q=*:*&indent=true&facet.range=time&facet=true&facet.range.start=2020-03-24T14:32:44.757Z&
  //facet.range.end=2020-03-28T14:32:44.758Z&facet.range.gap=%2B1728SECONDS&rows=0

  // /select?q=*:*&fq=time:[2020-03-24T14:32:44.757Z TO 2020-03-28T14:32:44.758Z]&facet=on&facet.field=level&facet.field=component&
  //rows=500&facet.mincount=1&facet.limit=10&fl=time,level,component,fullMessage,id&sort=time DESC
  constructor() {
    this.clear();
    this.body = {};
    this.sortingKeys = [];
    //this.sortingOrders = [];
  }

  newQuery() {
    this.clear();
    return this;
  }

  /**
   * Sets indent on or off
   * @param {boolean} indent indent or not, this is the question.
   */
  setIndent(indent) {
    this.indent = indent;
    return this;
  }

  /**
   * Sets the start time. Note, that you also need a end time if you set an start time.
   * @param {string} endTime End time as ISO String
   */
  setStartTime(startTime) {
    if (this.body.hasOwnProperty('time')) {
      this.body.time[0] = startTime;
    } else {
      this.body['time'] = [startTime, null];
    }
    return this;
  }

  /**
   * Sets the end time. Note, that you also need a start time if you set an end time.
   * @param {string} endTime End time as ISO String
   */
  setEndTime(endTime) {
    if (this.body.hasOwnProperty('time')) {
      this.body.time[1] = endTime;
    } else {
      this.body['time'] = [null, endTime];
    }
    return this;
  }

  /**
   * Sets facet on or off (default on): &facet={on/off}
   * @param {boolean} on
   */
  setFacetOn(on = true) {
    if (this.body.hasOwnProperty('facets')) {
      this.body.facets.facetOn = on;
    } else {
      this.body['facets'] = { facetOn: on };
    }
    return this;
  }

  /**
   * Sets stats on or off (default on): &stats={on/off}
   * @param {boolean} on
   */
  setStatsOn(on = true) {
    this.statsOn = on;
    return this;
  }
  /**
   * Sets the list of facet fields: &facet.field=listEntry1,facet.field=listEntry2,...
   * Example 1: setFacetFields(["A", "B", "A"], true) => &facet.field=A,facet.field=B
   * Example 2: setFacetFields(["A", "B", "A"], false) => &facet.field=A,facet.field=B,facet.field=A
   * @param {Array} fields Field array. If not an array, will be put into one.
   * @param {boolean} removeDuplicates Set this to true so any duplicate value will be removed
   */
  addFacetFields(fields, removeDuplicates) {
    if (fields) {
      fields = Array.isArray(fields) ? fields : [fields];
      let facetFields = removeDuplicates ? [...new Set(fields)] : fields;
      if (this.body.hasOwnProperty('facets')) {
        if (this.body.facets.hasOwnProperty('fields')) {
          this.body.facets.fields = [...this.body.facets.fields, ...facetFields];
        } else {
          this.body.facets['fields'] = facetFields;
        }
      } else {
        this.body['facets'] = { fields: facetFields };
      }
    }
    return this;
  }

  setFacetFieldSearchText(text) {
    if (this.body.hasOwnProperty('facets')) {
      this.body.facets.contains = text;
    } else {
      this.body['facets'] = { contains: text };
    }
    return this;
  }

  /**
   * Replaces any old filters with the given array.
   * @param {Array} filters
   */
  setFilters(filters) {
    if (filters && filters.length > 0) {
      this.body['filters'] = filters;
    }
    return this;
  }

  /**
   * Adds filters without replacing existing ones.
   * @param {Array} filters If not an array, will be put into one.
   */
  addFilters(filters) {
    if (filters) {
      filters = Array.isArray(filters) ? filters : [filters];
      if (this.body.hasOwnProperty('filters')) {
        this.body.filters = [...this.body.filters, ...filters];
      } else {
        this.body['filters'] = filters;
      }
    }
    return this;
  }

  setMarkedIds(markedRows) {
    if (markedRows) {
      let ids = getMarkedIds(markedRows);
      if (ids) {
        this.body['markedIds'] = ids;
      }
    }
    return this;
  }

  /**
   * Sets the number of rows: &rows={rows}
   * Example: setRows(500) => &rows=500
   * @param {number} rows number of rows
   */
  setRows(rows) {
    this.body['numRows'] = rows;
    return this;
  }

  /**
   * Sets the facet mincount: &facet.mincount={mincount}
   * Example: setFacetMincount(1): &facet.mincount=1
   * @param {number} mincount the mincount
   */
  setFacetMincount(mincount) {
    if (this.body.hasOwnProperty('facets')) {
      this.body.facets.minCount = mincount;
    } else {
      this.body['facets'] = { minCount: mincount };
    }
    return this;
  }

  /**
   * Sets the facet limit: &facet.limit={limit}
   * Example: setFacetLimit(100) => &facet.limit=100
   * @param {number} limit the limit
   */
  setFacetLimit(limit) {
    if (this.body.hasOwnProperty('facets')) {
      this.body.facets.maxCount = limit;
    } else {
      this.body['facets'] = { maxCount: limit };
    }
    return this;
  }

  /**
   * Sets the facet range: &facet.range={range}
   * Example: setFacetRange(time) => &facet.range=time
   * @param {string} range the range
   */
  setFacetRange(range) {
    this.body['facetsRange'] = { rangeField: range, rangeStart: 0, rangeEnd: 0, rangeGap: 0 };
    return this;
  }

  /**
   * Sets the facet range: &facet.range.start={start}
   * Example: setFacetRange(12386123) => &facet.range.start=12386123
   * @param {string} start the start time as ISO-String
   */
  setFacetRangeStart(start) {
    this.body['facetsRange']['rangeStart'] = start;
    return this;
  }

  /**
   * Sets the facet range: &facet.range.end={end}
   * Example: setFacetRangeEnd(12386123) => &facet.range.end=12386123
   * @param {string} end the end time as ISO-String
   */
  setFacetRangeEnd(end) {
    this.body['facetsRange']['rangeEnd'] = end;
    return this;
  }

  /**
   * Sets the facet range: &facet.range.gap=+{gap}{unit}
   * Example: setFacetRangeGap(123, SECONDS) => &facet.range.gap=+123SECONDS
   * @param {number} gap The gap
   * @param {string} unit the unit (default SECONDS)
   */
  setFacetRangeGap(gap, unit = 'SECONDS') {
    this.body['facetsRange']['rangeGap'] = '+' + gap + unit;
    return this;
  }

  /**
   * Sets the list of fields: &fl=listEntry1,listEntry2,...
   * Example 1: setFieldList(["A", "B", "C", "A"], true) => &fl=A,B,C
   * Example 2: setFieldList(["A", "B", "C", "A"], false) => &fl=A,B,C,A
   * @param {Array} fl Field list
   * @param {boolean} removeDuplicates Set this to true so any duplicate value will be removed
   */
  setFieldList(fl, removeDuplicates = true) {
    if (Array.isArray(fl)) {
      let fieldList = removeDuplicates ? [...new Set(fl)] : fl;
      this.body['fields'] = fieldList;
    }
    return this;
  }

  /**
   * Sets sorting parameter: &sort={key} {order}
   * Example: setSorting("time", "ASC") => &sort=time ASC
   * @param {string} key Key to be sorted for. This must be existing in fieldlist
   * @param {string} order Either ASC (ascending) or DESC (descending)
   */
  addSorting(key, order) {
    if (this.body.hasOwnProperty('sort')) {
      if (!this.sortingKeys.includes(key)) {
        this.body['sort'].push({ field: key, direction: order });
        this.sortingKeys.push(key);
      } else {
        // iterate over each element in the array
        for (var i = 0; i < this.body['sort'].length; i++) {
          if (this.body['sort'][i].field === key) {
            this.body['sort'][i].direction = order;
          }
        }
      }
    } else {
      this.body['sort'] = [{ field: key, direction: order }];
    }

    return this;
  }

  /**
   * Adds an additional parameter to the query
   * If param is null, nothing will happen
   * @param {string} param additional parameter. Example: add.field=1337
   */
  addAdditionalParam(param) {
    if (!param) {
      return this;
    }

    this.additionalParams.push(param);
    return this;
  }

  /**
   * Sets the facet offset: &facet.offset={offset}
   * Example: setFacetOffset(100) => &facet.offset=100
   * @param {number} offset the offset
   */
  setFacetOffset(offset) {
    if (this.body.hasOwnProperty('facets')) {
      this.body.facets.offset = offset;
    } else {
      this.body['facets'] = { offset: offset };
    }
    return this;
  }

  getSortingString() {
    var expr = '';
    for (var i = 0; i < this.sortingKeys.length; i++) {
      expr += '&sort=' + this.sortingKeys[i] + ' ' + this.sortingOrders[i];
    }
    return expr;
  }

  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
    return this;
  }

  setSuccessHandler(successHandler) {
    this.successHandler = successHandler;
    return this;
  }

  // query is search text
  setQ(q) {
    if (q !== null) {
      this.body['searchText'] = q;
    }
    return this;
  }

  /**
   * Creates the entire query based on the values you put in before.
   * Returns the query as an URI-encoded string.
   *
   */
  build(encodeUri = true) {
    const query = this.base + this.getQuery();

    this.clear();

    if (encodeUri) {
      return encodeURI(query);
    }

    return query;
  }

  send() {
    let host = config_env.API_LOGS;

    var xhr = $.ajax({
      type: 'POST',
      url: host,
      error: this.errorHandler,
      success: this.successHandler,
      headers: {
        'Content-Type': 'application/json',
      },
      xhrFields: {
        withCredentials: true
      },
      data: this.getQuery(),
    });
    return xhr;
  }

  sendGetDocument(id) {
    let host = config_env.API_LOGS;

    var xhr = $.ajax({
      type: 'GET',
      url: host + '/' + id,
      credentials: "include",
      error: this.errorHandler,
      success: this.successHandler,
      headers: {
        'Content-Type': 'application/json',
      },
      xhrFields: {
        withCredentials: true
      },
    });

    return xhr;
  }

  getQuery() {
    if (this.body.hasOwnProperty('markedIds')) {
      // eslint-disable-next-line no-unused-vars
      const { time, ...body } = this.body;
      this.body = body;
    }
    return JSON.stringify(this.body);
  }

  /**
   * Clears all data so you can start a new query
   */
  clear() {
    this.indent = null;
    this.base = null;
    this.startTime = null;
    this.endTime = null;
    this.facetOn = null;
    this.statsOn = null;
    this.facetFields = null;
    this.facetMincount = null;
    this.facetLimit = null;
    this.rows = null;
    this.fieldList = null;
    this.sortingKey = null;
    this.sortingOrder = null;
    this.additionalParams = [];
    this.facetOffset = null;
    this.facetRange = null;
    this.facetRangeStart = null;
    this.facetRangeEnd = null;
    this.facetRangeGapValue = null;
    this.facetRangeGapUnit = null;
    this.errorHandler = null;
    this.successHandler = null;
    this.q = '*:*';
    return this;
  }
}
