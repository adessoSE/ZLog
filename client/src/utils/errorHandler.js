import { toast } from 'react-toastify';
import { STATUS_TEXT_CANCELED } from '../Redux/_store/cancelRequestsMiddleware';

export function errorHandler(error, customMessage = '') {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code only
    if (error.statusText === STATUS_TEXT_CANCELED) {
      //console.log('request canceled');
    } else {
      console.error(error);
    }
  }
  if (error.statusText !== STATUS_TEXT_CANCELED) {
    toast.error(customMessage || error.message || error.responseText, { type: 'error' });
  }
}
