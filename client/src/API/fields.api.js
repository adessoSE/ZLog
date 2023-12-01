import $ from 'jquery';
import { makeOnError } from './helper/makeOnError';
import { config_env } from '../utils/Constants_env';

/**
 * returns a promise containg all the schema fields
 */
export function fetchAllSchemaFields() {
  const xhr = $.ajax({
    type: 'GET',
    url: config_env.API_LOGS_SCHEMA,
    dataType: 'json',
    error: makeOnError('An error occured while retrieving schema fields!'),
  });
  return xhr;
}
