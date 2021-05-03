import initialState from "./initialState";
import { API_CALL_ERROR, BEGIN_API_CALL } from "../actions/actionTypes";

const actionTypeEndsInSuccess = (type: string): boolean => {
  return type.substring(type.length - 8) === "_SUCCESS";
};

const apiCallStatusReducer = (
  state = initialState.apiCallsInProgress,
  action: { type: string }
): number => {
  if (action.type === BEGIN_API_CALL) {
    return state + 1;
  } else if (
    action.type === API_CALL_ERROR ||
    actionTypeEndsInSuccess(action.type)
  ) {
    return state - 1;
  }

  return state;
};

export default apiCallStatusReducer;