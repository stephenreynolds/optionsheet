import produce from "immer";
import { CHANGE_USERNAME_SUCCESS, DELETE_USER_SUCCESS, GET_USERNAME_SUCCESS } from "../actions/actionTypes";

interface UserState {
  username: string;
}

const initialState: Readonly<Partial<UserState>> = {};

const userReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USERNAME_SUCCESS:
    case CHANGE_USERNAME_SUCCESS:
      state.username = payload;
      break;
    case DELETE_USER_SUCCESS:
      state = initialState;
      break;
  }

  return state;
}, initialState);

export default userReducer;