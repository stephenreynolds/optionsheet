import produce from "immer";
import {
  GET_AUTHENTICATED_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL
} from "../actions/actionTypes";
import { User } from "../../common/models/user";

const initialState: Readonly<Partial<User>> = {};

const userReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_AUTHENTICATED_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      state = payload;
      break;
    case DELETE_USER_SUCCESS:
      state = initialState;
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      state = { };
  }

  return state;
}, initialState);

export default userReducer;