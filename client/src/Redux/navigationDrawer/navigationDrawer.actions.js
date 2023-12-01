export const SET_IS_DRAWER_OPEN = 'SET_IS_DRAWER_OPEN';

export const setIsDrawerOpen = (isOpen) => {
  return {
    type: SET_IS_DRAWER_OPEN,
    payload: isOpen,
  };
};
