import moment from 'moment';
import Constants from '../utils/Constants';
import { v1 as uuidv1 } from 'uuid';
import $ from 'jquery';
import { makeOnError } from './helper/makeOnError';
import { config_env } from '../utils/Constants_env';

let commentCache = [];
let validCache = false;
let timer = setTimeout(invalidateCache, 1000 * Constants.COMMENT_INVALIDATION_FREQUENCY_SEC);

function invalidateCache() {
  commentCache = [];
  validCache = false;
  clearTimeout(timer);
  timer = setTimeout(invalidateCache, 1000 * Constants.COMMENT_INVALIDATION_FREQUENCY_SEC);
}

/**
 *
 * @param {*} author author
 * @param {*} comment comment
 * @param {*} conditions conditions, given as json object, e.g., "conditions":"{\"level\":\"INFO\", \"component\":\"x\", \"port\":8983}",
 * @param {*} callback callback method that gets called after the response
 */
export function addComment(author, comment, conditions, callback) {
  const now = moment();

  let document = {
    author: author,
    time: now,
    comment: comment,
    conditions: JSON.stringify(conditions),
    id: uuidv1(),
    creationtime: now,
  };

  return $.ajax({
    type: 'PUT',
    url: config_env.API_COMMENTS,
    data: JSON.stringify(document),
    xhrFields: {
      withCredentials: true
    },
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('An error occured while adding a comment!'),
    success: (jqXHR) => {
      invalidateCache();
      callback(jqXHR);
      return jqXHR;
    },
  });
}

/**
 *
 * @param {*} id id of the comment to edit
 * @param {*} comment new comment text
 * @param {*} conditions conditions, given as json object, e.g., "conditions":"{\"level\":\"INFO\", \"component\":\"x\", \"port\":8983}",
 * @param {*} callback callback method that gets called after the response
 */
export function editComment(id, comment, conditions, callback) {
  let document = {
    id: id,
    time: moment(),
    comment: comment,
    conditions: JSON.stringify(conditions),
  };

  const xhr = $.ajax({
    type: 'PUT',
    url: config_env.API_COMMENTS,
    data: JSON.stringify(document),
    xhrFields: {
      withCredentials: true
    },
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('An error occured while editing comment!'),
    success: (jqXHR) => {
      invalidateCache();
      callback(jqXHR);
      return jqXHR;
    },
  });
  return xhr;
}

/**
 *
 * @param {*} id id of the comment to delete
 */
export function deleteComment(id, callback) {
  const xhr = $.ajax({
    type: 'DELETE',
    url: config_env.API_COMMENTS + '/' + id,
    headers: { Accept: 'application/json' },
    xhrFields: {
      withCredentials: true
    },
    error: makeOnError('An error occured while deleting comment!'),
    success: (jqXHR) => {
      invalidateCache();
      callback(jqXHR);
      return jqXHR;
    },
  });
  return xhr;
}

/**
 * fetches up to 5000 comments
 */
export function fetchComments() {
  // var queryString = '/select?q=*:*&rows=5000&sort=creationtime+desc';
  var query = {};
  query['numRows'] = 5000;
  //query['sort'] = [{ field: 'creationtime', direction: 'desc' }];

  const xhr = $.ajax({
    type: 'POST',
    url: config_env.API_COMMENTS,
    data: JSON.stringify(query),
    xhrFields: {
      withCredentials: true
    },
    headers: {
      'Content-Type': 'application/json',
    },
    error: makeOnError('An error occured while retrieving comments!'),
    success: (response) => response,
  });
  return xhr;
}

/**
 * find matching comments to show for the log, returns an array of comment json objects
 * @param {*} log log as json object
 */
export function extractCommentsForLog(log, force = false) {
  // if we have a valid cache and do not want to force fetch, dont do anything
  if (!force && validCache) {
    return new Promise((r) => {
      return r(matchComments(commentCache, log));
    });
  }

  return fetchComments().then((data) => {
    var all = JSON.parse(data)['docs'];

    //we just fetched all comments. At this point, our cache is valid
    commentCache = all;
    validCache = true;

    return matchComments(all, log);
  });
}

function matchComments(comments, log) {
  var matched = [];
  for (var i = 0; i < comments.length; i++) {
    // iterate all comments to find matches
    var comm = comments[i];
    var conditions = JSON.parse(comm.conditions);
    var isMatch = true;
    for (var j = 0; isMatch && j < Object.keys(conditions).length; j++) {
      var cKey = Object.keys(conditions)[j]; // condition key
      var value = conditions[cKey];
      if (log && log.hasOwnProperty(cKey)) {
        isMatch =
          isMatch && Array.isArray(log[cKey]) ? log[cKey][0].toString() === value : log[cKey].toString() === value;
      } else {
        isMatch = false;
      }
    }
    if (isMatch) {
      matched.push(comm);
    } // out-of-loop
    // if (true) { matched.push(comm); } // for testing: match everything
  }
  //console.log(matched)

  return matched;
}
