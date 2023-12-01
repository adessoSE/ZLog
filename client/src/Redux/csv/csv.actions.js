import { downloadCSV } from '../../API/csv.api';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { requestEndAction, requestStartAction } from '../actions';
import { REQ_DOWNLOAD_CSV } from '../../utils/requestTypes';
import { errorHandler } from '../../utils/errorHandler';
import { Parser } from 'json2csv';

export const downloadCSVAction = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const xhr = downloadCSV(state);
      dispatch(requestStartAction(REQ_DOWNLOAD_CSV, xhr));
      if (typeof xhr === 'undefined'){
        onSuccess({});
      } else {
        const response = await promisifyXhr(xhr);
        onSuccess(JSON.parse(response)['docs']);
      }
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_DOWNLOAD_CSV));
  };
};

function onSuccess(data) {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);
  let url = window.URL.createObjectURL(new Blob(['sep=,\n' + csv]));
  let a = document.createElement('a');
  a.href = url;
  a.download = 'Logging.csv';
  a.click();
}
