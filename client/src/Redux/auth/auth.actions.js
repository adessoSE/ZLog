import {login} from '../../API/auth.api';
import {errorHandler} from '../../utils/errorHandler';
import {promisifyXhr} from '../../utils/promisifyXhr';
import {REQ_LOGIN} from '../../utils/requestTypes';
import {requestEndAction, requestStartAction} from '../actions';
import {config_env} from "../../utils/Constants_env";

export const SET_TOKEN = 'SET_TOKEN';
export const LOGOUT = 'LOGOUT';
export const DELETE_TOKEN = 'LOGOUT';

export const setToken = (payload) => {
  return {
    type: SET_TOKEN,
    payload,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export function sendLoginRequest(username, password) {
  return async (dispatch) => {
    try {
      if (true || process.env.REACT_APP_FAKE_LOGIN === 'true') {
        const data = {
          token: 'testtoken',
          name: '',
          message: 'null',
          roles: ['testrole'],
          email: '',
          enumber: 'testnumber',
        };
        dispatch(setToken(data));
      } else {
        const xhr = login({ username, password });
        dispatch(requestStartAction(REQ_LOGIN, xhr));
        const data = await promisifyXhr(xhr);
        dispatch(setToken(data));
      }

      /*const listData = prepareDataForResultList(data);
      dispatch(updateListData(listData));
      if (!onlyTable) {
        dispatch(setTotalFound(data['response']['numFound']));
        if (facetOn) {
          const facetData = transformFacetDataToList(data['facet_counts']['facet_fields'], activeNavigators);
          dispatch(setFacetData(facetData));
        }
      }*/
    } catch (error) {
      errorHandler(error);
    }
    dispatch(requestEndAction(REQ_LOGIN));
  };
}


export function checkOAuthAuthorizationState2() {
  return async (dispatch) => {
    try {
      let host = config_env.API_LOGS

      const response = await fetch(
          host,
          {method: 'GET', redirect: "follow", credentials: "include"}
      ).then((response) => response);

      console.log(response)
      if (response.redirected) {
        document.location = response.url;
      }
    } catch (error) {
      errorHandler(error);
    }
  };
}

export function oAuth2LogOut() {
  document.location = config_env.API_OAUTH_LOGOUT

}