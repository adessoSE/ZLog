import $ from 'jquery';
import Constants from '../utils/Constants';
import { makeOnError } from './helper/makeOnError';

export function deleteTriggerRequest(trigger, success) {
  /*let query = {
    delete: {
      query: 'id:' + trigger.id,
    },
  };*/

  return $.ajax({
    type: 'DELETE',
    url: Constants.solrTriggerEvents + '/' + trigger.id,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    error: makeOnError('Deleting trigger failed!'),
    success: success,
  });
}

export function saveTriggerRequest(doc, success) {
  return $.ajax({
    type: 'POST',
    url: Constants.solrTriggerEvents + '/',
    data: JSON.stringify(doc),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('Saving trigger failed!'),
    success: success,
  });
}

export function fetchAllTriggersRequest(success) {
  const queryString = '/';
  const query = encodeURI(queryString);

  const xhr = $.ajax({
    type: 'GET',
    url: Constants.solrTriggerEvents + query,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('Fetching triggers failed!'),
    success: success,
  });

  return xhr;
}

export function toggleTriggerEnabledRequest(trigger, success) {
  trigger.active = !trigger.active;

  return $.ajax({
    type: 'POST',
    url: Constants.solrTriggerEvents + '/',
    data: JSON.stringify(trigger),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('Enable/disable triggers failed!'),
    success: success,
  });
}
