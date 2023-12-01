import {LOGOUT, oAuth2LogOut, SET_TOKEN} from './auth.actions';
import { security_env } from '../../utils/Constants_env';

export const initialState = {
  token: null,
};

export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TOKEN:
      return {
        ...state,
        token: payload,
      };
    case LOGOUT:
      if (security_env === true) {
        oAuth2LogOut();
      }

      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};
