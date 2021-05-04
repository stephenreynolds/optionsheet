export const getIsLoggedIn = (state): boolean => {
  return state.authenticateReducer.isLoggedIn;
};

export const getMessage = (state): string => {
  return state.message;
};