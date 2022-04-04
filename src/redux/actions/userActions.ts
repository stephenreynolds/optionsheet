import { GET_AUTHENTICATED_USER_SUCCESS, LOGOUT_SUCCESS } from "./actionTypes";
import * as userApi from "../../common/api/user";

export const getAuthenticatedUser = () => {
  return async (dispatch) => {
    try {
      const payload = await userApi.getAuthenticatedUser();
      dispatch({ type: GET_AUTHENTICATED_USER_SUCCESS, payload });
    }
    catch (error) {
      dispatch(logout());
      throw error.response.data;
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT_SUCCESS });
  };
};
