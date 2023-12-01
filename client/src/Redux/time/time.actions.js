import {
  CHANGE_END_TIME,
  CHANGE_INTERMEDIATE_END_TIME,
  CHANGE_INTERMEDIATE_START_TIME,
  CHANGE_START_TIME,
  CHANGE_TIME,
} from './time.actionTypes';

export function changeStartTime(startTime) {
  return { type: CHANGE_START_TIME, payload: startTime };
}

export function changeEndTime(endTime) {
  return { type: CHANGE_END_TIME, payload: endTime };
}

export function changeTime(payload) {
  return { type: CHANGE_TIME, payload };
}

export function changeIntermediateStartTime(startTime) {
  return { type: CHANGE_INTERMEDIATE_START_TIME, payload: startTime };
}

export function changeIntermediateEndTime(endTime) {
  return { type: CHANGE_INTERMEDIATE_END_TIME, payload: endTime };
}
