import api, { baseURL } from "./api";
import { DefaultProjectSettingsModel, UserUpdateModel } from "../models/user";

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

export const setAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    return "/img/profile.png";
  }

  return `${baseURL}/${avatarUrl}`;
};

export const getDefaultProjectSettings = async () => {
  return api.get(`/user/settings`);
};

export const updateDefaultProjectSettings = async (model: DefaultProjectSettingsModel) => {
  return await api.patch(`/user/settings`, model);
};

export const starProject = async (ownerUsername: string, projectName: string) => {
  return await api.put(`/user/starred/${ownerUsername}/${projectName}`);
};

export const unStarProject = async (ownerUsername: string, projectName: string) => {
  return await api.delete(`/user/starred/${ownerUsername}/${projectName}`);
};

export const setPinnedProjects = async (projectIds: number[]) => {
  return await api.put(`/user/pinned`, { projectIds });
};

export const checkProjectStarred = async (ownerUsername: string, projectName: string) => {
  return await api.get(`/user/starred/${ownerUsername}/${projectName}`);
};

export const getStarredProjects = async (username: string) => {
  return await api.get(`/users/${username}/starred`);
};

export const getPinnedProjects = async (username: string) => {
  return await api.get(`/users/${username}/pinned`);
};