import {
  SET_LIVE_VIEW,
  SET_LIVE_VIEW_FREQUENCY,
  SET_LIVE_VIEW_PAUSED,
  TOGGLE_LIVE_VIEW,
  SET_LIVE_VIEW_UNIT,
} from './liveView.actionTypes';
import Constants from '../../utils/Constants';

export const initialState = {
  active: false,
  paused: false,
  updateFrequency: Constants.VALUE_FREQ_MIN_MS,
  unit: Constants.VALUE_FREQ_DEFAULT_UNIT,
};

export const liveViewReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LIVE_VIEW:
      return { ...state, active: payload };
    case SET_LIVE_VIEW_FREQUENCY:
      return { ...state, updateFrequency: payload };
    case TOGGLE_LIVE_VIEW:
      return { ...state, active: !state.active };
    case SET_LIVE_VIEW_PAUSED:
      return { ...state, paused: payload };
    case SET_LIVE_VIEW_UNIT:
      return { ...state, unit: payload };
    default:
      return state;
  }
};
