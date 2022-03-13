import * as authApi from "../../common/api/auth";
import { CreateUserModel, Credentials } from "../../common/models/user";
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "./actionTypes";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const register = (model: CreateUserModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return authApi.register(model)
      .then((data) => {
        dispatch({ type: REGISTER_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: REGISTER_FAIL });
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const login = (credentials: Credentials) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return authApi.login(credentials)
      .then((data) => {
        dispatch({ type: LOGIN_SUCCESS, payload: data });
      })
      .catch((error) => {
        dispatch({ type: LOGIN_FAIL });
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(beginApiCall());
    authApi.logout()
      .then(() => {
        dispatch({ type: LOGOUT_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};