import { User } from "../../common/models/user";

export const getUser = (state): User => {
  return state.user;
};

export const getUsername = (state): string => {
  return state.user.username ?? undefined;
};

export const getEmail = (state): string => {
  return state.user.email ?? undefined;
};