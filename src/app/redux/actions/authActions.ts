import { CreateUserModel, Credentials } from "../../common/user";
import * as userManager from "../../common/userManager";
import {
  GET_MY_INFO_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SET_MESSAGE
} from "./actionTypes";

type DispatchFunc = (arg: { type: string; payload?: any }) => void;

export const register = (model: CreateUserModel) => {
  return (dispatch: DispatchFunc) => {
    return userManager.register(model).then(
      (response) => {
        dispatch({ type: REGISTER_SUCCESS });
        dispatch({ type: SET_MESSAGE, payload: response.data.message });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({ type: REGISTER_FAIL });
        dispatch({ type: SET_MESSAGE, payload: message });
        return Promise.reject();
      }
    );
  };
};

export const login = (credentials: Credentials) => {
  return (dispatch: DispatchFunc) => {
    return userManager.login(credentials).then(
      (data) => {
        dispatch({ type: LOGIN_SUCCESS, payload: data });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({ type: LOGIN_FAIL });
        dispatch({ type: SET_MESSAGE, payload: message });
        return Promise.reject();
      }
    );
  };
};

export const logout = () => {
  return (dispatch: DispatchFunc) => {
    userManager.logout();
    dispatch({ type: LOGOUT });
  };
};

export const getMyInfo = () => {
  return (dispatch: DispatchFunc) => {
    return userManager.getMyInfo().then(
      (response) => {
        dispatch({ type: GET_MY_INFO_SUCCESS, payload: response.data });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({ type: SET_MESSAGE, payload: message });
        return Promise.reject();
      }
    );
  };
};
