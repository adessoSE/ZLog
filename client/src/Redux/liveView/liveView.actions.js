import {
  SET_LIVE_VIEW,
  SET_LIVE_VIEW_FREQUENCY,
  SET_LIVE_VIEW_PAUSED,
  TOGGLE_LIVE_VIEW,
  SET_LIVE_VIEW_UNIT,
} from './liveView.actionTypes';
import { getFactorForUnit } from './liveView.helper';

export const setLiveView = (bool) => {
  return {
    type: SET_LIVE_VIEW,
    payload: bool,
  };
};

/**
 *
 * @param {Integer} num Amount
 * @param {String} unit Unit of the amount. Using ms if blank
 */
export const setLiveViewFrequency = (num, unit) => {
  const factor = getFactorForUnit(unit);
  return {
    type: SET_LIVE_VIEW_FREQUENCY,
    payload: num * factor,
  };
};

export const toggleLiveView = () => {
  return {
    type: TOGGLE_LIVE_VIEW,
  };
};

export const setLiveViewPaused = (bool) => {
  return {
    type: SET_LIVE_VIEW_PAUSED,
    payload: bool,
  };
};

export const setLiveViewUnit = (unit) => {
  return {
    type: SET_LIVE_VIEW_UNIT,
    payload: unit,
  };
};
