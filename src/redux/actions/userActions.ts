import * as userApi from "../../common/userApi";
import {
  CHANGE_EMAIL_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_USERNAME_SUCCESS,
  DELETE_USER_SUCCESS,
  GET_AUTHENTICATED_USER_SUCCESS,
  LOGIN_FAIL
} from "./actionTypes";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import { logout } from "./authActions";

export const getAuthenticatedUser = () => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.getAuthenticatedUser()
      .then(response => {
        dispatch({ type: GET_AUTHENTICATED_USER_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: LOGIN_FAIL });
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const changeUsername = (username: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.changeUsername(username)
      .then(() => {
        dispatch({ type: CHANGE_USERNAME_SUCCESS, payload: username });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const changePassword = (password: string, confirm: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.changePassword(password, confirm)
      .then(() => {
        dispatch({ type: CHANGE_PASSWORD_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const changeEmail = (email: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.changeEmail(email)
      .then(() => {
        dispatch({ type: CHANGE_EMAIL_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const deleteUser = (username: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.deleteUser(username)
      .then(() => {
        dispatch({ type: DELETE_USER_SUCCESS });
        dispatch(logout());
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};