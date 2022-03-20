import api from "./api";
import { UserUpdateModel } from "../models/user";

export const getAuthenticatedUser = () => {
  return api.get(`/user`);
};

export const getUser = (username: string) => {
  return api.get(`/users/${username}`);
};

export const updateUser = async (data: UserUpdateModel) => {
  return api.patch(`/user`, data);
};

export const deleteUser = async () => {
  return api.delete(`/user`);
};

export const starProject = async (ownerUsername: string, projectName: string) => {
  return await api.put(`/user/starred/${ownerUsername}/${projectName}`);
};

export const unStarProject = async (ownerUsername: string, projectName: string) => {
  return await api.delete(`/user/starred/${ownerUsername}/${projectName}`);
};

export const checkProjectStarred = async (ownerUsername: string, projectName: string) => {
  return await api.get(`/user/starred/${ownerUsername}/${projectName}`);
};

export const getStarredProjects = async (username: string) => {
  return await api.get(`/users/${username}/starred`);
};