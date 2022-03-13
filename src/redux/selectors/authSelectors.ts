export const getIsLoggedIn = (state): boolean => {
  return state.auth.token;
};