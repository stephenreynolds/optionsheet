import * as authApi from "../../common/api/auth";
import { CreateUserModel, Credentials } from "../../common/models/user";
import { GET_AUTHENTICATED_USER_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL } from "./actionTypes";
import * as userApi from "../../common/api/user";

export const getAuthenticatedUser = () => {
  return async (dispatch) => {
    try {
      const response = await userApi.getAuthenticatedUser();
      dispatch({ type: GET_AUTHENTICATED_USER_SUCCESS, payload: response.data });
    }
    catch (error) {
      dispatch({ type: LOGIN_FAIL });
      throw error.response.data;
    }
  };
};

export const register = (model: CreateUserModel) => {
  return async (dispatch) => {
    try {
      await authApi.register(model);
      dispatch(getAuthenticatedUser());
    }
    catch (error) {
      dispatch({ type: REGISTER_FAIL });
      throw error.response.data;
    }
  };
};

export const login = (credentials: Credentials) => {
  return async (dispatch) => {
    try {
      await authApi.login(credentials);
      dispatch(getAuthenticatedUser());
    }
    catch (error) {
      dispatch({ type: LOGIN_FAIL });
      throw error.response.data;
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT_SUCCESS });
  };
};
