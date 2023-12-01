export const selectAllFields = (state) => state.fields.allFields;
export const selectActiveFields = (state) => state.fields.activeFields;
export const selectAllNavigators = (state) => state.fields.allNavigators;
export const selectActiveNavigators = (state) => state.fields.activeNavigators;

export const selectAllNonActiveFields = (state) =>
  selectAllFields(state).filter((field) => !selectActiveFields(state).includes(field));

export const selectAllNonActiveNavigators = (state) =>
  selectAllNavigators(state).filter((navigator) => !selectActiveNavigators(state).includes(navigator));
