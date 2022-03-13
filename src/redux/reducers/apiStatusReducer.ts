import { API_CALL_ERROR, BEGIN_API_CALL } from "../actions/actionTypes";

const actionEndsInSuccess = (type) => {
  return type.substring(type.length - 8) === "_SUCCESS";
};

const initialState = 0;

const apiStatusReducer = (state = initialState, action) => {
  const { type } = action;

  if (type === BEGIN_API_CALL) {
    return state + 1;
  }
  if (type === API_CALL_ERROR || actionEndsInSuccess(type)) {
    return state - 1;
  }

  return state;
};

export default apiStatusReducer;