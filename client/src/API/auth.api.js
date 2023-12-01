import Constants from '../utils/Constants';
import { makeOnError } from './helper/makeOnError';
import $ from 'jquery';

export function login(credentials) {
  return $.ajax({
    type: 'POST',
    url: Constants.auth + '/user',
    data: JSON.stringify(credentials),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    error: makeOnError('An error occured while trying to log in!'),
    success: (jqXHR) => {
      return jqXHR;
    },
  });
}
