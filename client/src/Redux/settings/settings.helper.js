import $ from 'jquery';
import { config_env } from '../../utils/Constants_env';

export function requestSaveDocument(document) {
  return $.ajax({
    type: 'PUT',
    url: config_env.API_SETTINGS,
    data: JSON.stringify(document),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  });
}

export function requestUserSettings(start = 0, rows = 10, text = '') {
  var request = {};
  request['start'] = start;
  request['numRows'] = rows;
  if (text !== '') {
    // queryString += 'id:*' + text + '* OR description:*' + text + '*';
    // todo is search in description necessary/possible?
    request['filters'] = [{ key: 'id', values: [text], negated: false }];
  }

  var xhr = $.ajax({
    type: 'POST',
    url: config_env.API_SETTINGS,
    data: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return xhr;
}

export function requestDeleteSetting(id) {
  return $.ajax({
    type: 'DELETE',
    url: config_env.API_SETTINGS + '/' + id,
    headers: { Accept: 'application/json' },
  });
}

export function requestSettingsById(id) {
  return $.ajax({
    type: 'GET',
    url: config_env.API_SETTINGS + '/' + id,
    headers: { Accept: 'application/json' },
  });
}
