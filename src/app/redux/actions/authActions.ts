import { CreateUserModel, Credentials } from "../../common/models/user";
import * as userManager from "../../common/userManager";
import {
  GET_MY_INFO_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from "./actionTypes";

type DispatchFunc = (arg: { type: string; payload?: any }) => void;

export const register = (model: CreateUserModel) => {
  return (dispatch: DispatchFunc) => {
    return userManager.register(model).then(
      () => {
        dispatch({ type: REGISTER_SUCCESS });
        return Promise.resolve();
      },
      () => {
        dispatch({ type: REGISTER_FAIL });
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
      () => {
        dispatch({ type: LOGIN_FAIL });
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
    return userManager.getMyInfo().then((response) => {
      dispatch({ type: GET_MY_INFO_SUCCESS, payload: response.data });
      return Promise.resolve();
    });
  };
};
