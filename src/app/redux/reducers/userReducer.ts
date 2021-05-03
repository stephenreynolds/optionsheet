import initialState from "./initialState";
import { CREATE_USER_SUCCESS } from "../actions/actionTypes";

const userReducer = (
  state = initialState.user,
  action: { type: string; }
) => {
  switch (action.type) {
    case CREATE_USER_SUCCESS:
      return state;
    default:
      return state;
  }
};

export default userReducer;
