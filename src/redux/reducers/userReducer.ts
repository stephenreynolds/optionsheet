import produce from "immer";
import {
  CHANGE_USERNAME_SUCCESS,
  DELETE_USER_SUCCESS,
  GET_AUTHENTICATED_USER_SUCCESS
} from "../actions/actionTypes";
import { User } from "../../common/models/user";

const initialState: Readonly<Partial<User>> = {};

const userReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_AUTHENTICATED_USER_SUCCESS:
      state = payload;
      break;
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