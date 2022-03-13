import { API_CALL_ERROR, BEGIN_API_CALL } from "./actionTypes";

export const beginApiCall = () => {
  return { type: BEGIN_API_CALL };
};

export const apiCallError = () => {
  return { type: API_CALL_ERROR };
};