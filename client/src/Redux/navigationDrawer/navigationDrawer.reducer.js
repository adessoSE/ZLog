import { SET_IS_DRAWER_OPEN } from './navigationDrawer.actions';

export const initialState = {
  isDrawerOpen: false,
};

export const navigationDrawerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_IS_DRAWER_OPEN:
      return { isDrawerOpen: payload };
    default:
      return state;
  }
};
