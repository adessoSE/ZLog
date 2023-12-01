import { UPDATE_HISTOGRAM_DATA, SET_HISTOGRAM_TYPE } from './histogram.actionTypes';

export function histogramDataReducer(state = {data: [], chartType: 'linear'}, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_HISTOGRAM_DATA:
      return { ...state, data: [...payload]};
    case SET_HISTOGRAM_TYPE:
      return { ...state, chartType: payload };
    default:
      return state;
  }
}
