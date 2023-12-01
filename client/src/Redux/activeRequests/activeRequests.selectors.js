export const selectIsAnyRequestActive = (state) => state.activeRequests.active > 0;
export const selectIsRequestTypeActive = (state, type) => !!state.activeRequests.types[type];

/**
 * returns true if one of the given request types is active
 *
 * @param state
 * @param { string[] }types - array of request types
 * @returns {boolean}
 */
export const selectIsOneOfRequestTypesActive = (state, types = []) => {
  return types.some((type) => selectIsRequestTypeActive(state, type));
};
