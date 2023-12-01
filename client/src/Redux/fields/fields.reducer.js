import {
  SET_ACTIVE_FIELDS,
  SET_ALL_FIELDS,
  SET_ALL_NAVIGATORS,
  SET_ACTIVE_NAVIGATORS,
  ADD_ACTIVE_FIELDS,
  REMOVE_ACTIVE_FIELDS,
} from './fields.actionTypes';
import uniq from 'lodash/uniq';

export const initialState = {
  allNavigators: [],
  activeNavigators: ['level', 'component'],
  allFields: [],
  activeFields: ['time', 'level', 'logFileName', 'message'],
};

export const fieldsReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_FIELDS:
      return {
        ...state,
        allFields: [...payload],
      };
    case SET_ACTIVE_FIELDS:
      return {
        ...state,
        activeFields: [...payload],
      };
    case ADD_ACTIVE_FIELDS: {
      return {
        ...state,
        activeFields: uniq([...state.activeFields, ...payload]),
      };
    }
    case REMOVE_ACTIVE_FIELDS: {
      return {
        ...state,
        activeFields: state.activeFields.filter((fieldName) => !payload.includes(fieldName)),
      };
    }
    case SET_ACTIVE_NAVIGATORS:
      return {
        ...state,
        activeNavigators: [...payload],
      };
    case SET_ALL_NAVIGATORS:
      return {
        ...state,
        allNavigators: [...payload],
      };
    default:
      return state;
  }
};
