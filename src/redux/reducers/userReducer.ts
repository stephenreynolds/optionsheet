import produce from "immer";
import { GET_AUTHENTICATED_USER_SUCCESS, LOGOUT_SUCCESS } from "../actions/actionTypes";
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
      logout();
      state = initialState;
      break;
  }

  return state;
}, initialState);

export default userReducer;
