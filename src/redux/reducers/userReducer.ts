import produce from "immer";
import { GET_AUTHENTICATED_USER_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL } from "../actions/actionTypes";
import { User } from "../../common/models/user";
import { logout } from "../../common/api/auth";

const initialState: Readonly<Partial<User>> = null;

const userReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_AUTHENTICATED_USER_SUCCESS:
      state = payload;
      break;
    case LOGOUT_SUCCESS:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      logout();
      state = initialState;
      break;
  }

  return state;
}, initialState);

export default userReducer;
