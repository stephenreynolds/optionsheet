import produce from "immer";
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/actionTypes";

interface AuthReducerState {
  isLoggedIn: boolean;
  token: string;
}

const token = window.localStorage.getItem("token");

const initialState: Readonly<Partial<AuthReducerState>> = {
  isLoggedIn: !!token,
  token
};

const authenticateReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case REGISTER_FAIL:
      state.isLoggedIn = false;
      break;
    case LOGIN_SUCCESS:
      state.isLoggedIn = true;
      state.token = payload.token;
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      state = { };
      window.localStorage.removeItem("token");
      break;
  }

  return state;
}, initialState);

export default authenticateReducer;
