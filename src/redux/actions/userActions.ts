import { UserUpdateModel } from "../../common/models/user";
import * as userApi from "../../common/api/user";
import {
  DELETE_USER_SUCCESS,
  GET_AUTHENTICATED_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  LOGIN_FAIL, GET_USER_SUCCESS
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

export const getUser = (username: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.getUser(username)
      .then(response => {
        dispatch({ type: GET_USER_SUCCESS });
        return response.data;
      })
      .catch(error => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const updateUser = (data: UserUpdateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.updateUser(data)
      .then((response) => {
        dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const deleteUser = () => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return userApi.deleteUser()
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