import { CreateUserModel } from "../../common/user";
import { apiCallError, beginApiCall } from "./apiStatusActions";
import * as userManager from "../../common/userManager";
import { CREATE_USER_SUCCESS } from "./actionTypes";

const createUserSuccess = () => {
  return { type: CREATE_USER_SUCCESS };
};

export const createUser = (user: CreateUserModel) => {
  return (dispatch): Promise<void> => {
    dispatch(beginApiCall());
    return userManager
      .createUser(user)
      .then(() => dispatch(createUserSuccess()))
      .catch((error) => {
        dispatch(apiCallError());
        throw error;
      });
  };
};
