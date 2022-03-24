import produce from "immer";
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/actionTypes";

interface AuthReducerState {
  token: string;
  refreshToken: string;
}

const initialState: Readonly<Partial<AuthReducerState>> = {
  token: window.localStorage.getItem("token"),
  refreshToken: window.localStorage.getItem("refresh_token")
};

const authenticateReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      state = payload;
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      state = { };
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refresh_token");
      break;
  }

  return state;
}, initialState);

export default authenticateReducer;
