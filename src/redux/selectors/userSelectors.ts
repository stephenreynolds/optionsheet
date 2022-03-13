import { User } from "../../common/models/user";

export const getMyInfo = (state): User => {
  return state.user;
};

export const getMyUsername = (state): string => {
  return state.user ? state.user.username : undefined;
};