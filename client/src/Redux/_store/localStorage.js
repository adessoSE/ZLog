const KEY_FOR_STATE = 'persistedState';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(KEY_FOR_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY_FOR_STATE, serializedState);
  } catch {
    // ignore write errors
  }
};
