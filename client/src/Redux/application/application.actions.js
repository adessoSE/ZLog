import { requestEndAction, requestStartAction } from '../actions';
import { REQ_APPLICATIONS } from '../../utils/requestTypes';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { errorHandler } from '../../utils/errorHandler';
import { fetchAllApplications } from '../../API/applications.api';
import { prepareApplicationData } from './application.helper';
import { SET_ALL_APPLICATIONS, SET_SELECTED_APPLICATION } from './application.actionTypes';

export const setAllApplications = (payload) => {
  return {
    type: SET_ALL_APPLICATIONS,
    payload,
  };
};

export const setSelectedApplication = (payload) => {
  return {
    type: SET_SELECTED_APPLICATION,
    payload,
  };
};

export const fetchAllApplicationsAction = () => {
  return async (dispatch) => {
    try {
      const xhr = fetchAllApplications();
      dispatch(requestStartAction(REQ_APPLICATIONS, xhr));
      const data = await promisifyXhr(xhr);

      dispatch(setAllApplications(prepareApplicationData(data)));
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_APPLICATIONS));
  };
};
