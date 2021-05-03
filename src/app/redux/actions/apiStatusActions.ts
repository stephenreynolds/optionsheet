import { API_CALL_ERROR, BEGIN_API_CALL } from "./actionTypes";

export const beginApiCall = (): { type: string } => {
  return { type: BEGIN_API_CALL };
};

export const apiCallError = (): { type: string } => {
  return { type: API_CALL_ERROR };
};
