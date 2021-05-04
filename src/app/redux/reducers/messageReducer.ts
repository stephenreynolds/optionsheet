import initialState from "./initialState";
import { CLEAR_MESSAGE, SET_MESSAGE } from "../actions/actionTypes";

const messageReducer = (state = initialState.message, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { message: payload };
    case CLEAR_MESSAGE:
      return { message: "" };
    default:
      return state;
  }
};

export default messageReducer;
