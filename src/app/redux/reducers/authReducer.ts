import initialState from "./initialState";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from "../actions/actionTypes";

const authenticateReducer = (state = initialState.user, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return { ...state, isLoggedIn: false };
    case REGISTER_FAIL:
      return { ...state, isLoggedIn: false };
    case LOGIN_SUCCESS:
      return { ...state, isLoggedIn: true, token: payload.token };
    case LOGIN_FAIL:
      return { ...state, isLoggedIn: false, token: null };
    case LOGOUT:
      return { ...state, isLoggedIn: false, token: null };
    default:
      return state;
  }
};

export default authenticateReducer;
