import moment from 'moment';
import {
  CHANGE_END_TIME,
  CHANGE_INTERMEDIATE_START_TIME,
  CHANGE_INTERMEDIATE_END_TIME,
  CHANGE_START_TIME,
  CHANGE_TIME,
} from './time.actionTypes';

export const getInitialTimeState = () => {
  return {
    startTime: moment().subtract(3, 'days').valueOf(),
    endTime: moment().add(1, 'days').valueOf(),
    intermediateStartTime: moment().subtract(3, 'days').valueOf(),
    intermediateEndTime: moment().add(1, 'days').valueOf(),
  };
};

export const initialState = getInitialTimeState();

export function timeReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_START_TIME:
      return { ...state, startTime: payload };
    case CHANGE_END_TIME:
      return { ...state, endTime: payload };
    case CHANGE_TIME:
      return { ...state, ...payload };
    case CHANGE_INTERMEDIATE_START_TIME:
      return { ...state, intermediateStartTime: payload };
    case CHANGE_INTERMEDIATE_END_TIME:
      return { ...state, intermediateEndTime: payload };
    default:
      return state;
  }
}
