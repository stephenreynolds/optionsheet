import api from "./api";
import { UserUpdateModel } from "../models/user";

export const getAuthenticatedUser = () => {
  return api.get(`/user`);
};

export const updateUser = async (data: UserUpdateModel) => {
  return api.patch(`/user`, data);
};

export const deleteUser = async () => {
  return api.delete(`/user`);
};