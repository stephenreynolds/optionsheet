import api, { baseURL, ApiResponse } from "./api";
import { DefaultProjectSettingsModel, User, UserUpdateModel } from "../models/user";
import { Project } from "../models/project";

export const getAuthenticatedUser = () => {
  return api.get(`/user`);
};

export const getUser = (username: string): ApiResponse<User> => {
  return api.get(`/users/${username}`);
};

export const updateUser = async (data: UserUpdateModel): ApiResponse<User> => {
  return api.patch(`/user`, data);
};

export const deleteUser = async (): ApiResponse<void> => {
  return api.delete(`/user`);
};

export const setAvatar = async (file): ApiResponse<{ avatar_url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getAvatarUrl = (avatarUrl): string => {
  if (!avatarUrl) {
    return "/img/profile.png";
  }

  return `${baseURL}/${avatarUrl}`;
};

export const getDefaultProjectSettings = async (): ApiResponse<DefaultProjectSettingsModel> => {
  return api.get(`/user/settings`);
};

export const updateDefaultProjectSettings = async (model: DefaultProjectSettingsModel): ApiResponse<DefaultProjectSettingsModel> => {
  return await api.patch(`/user/settings`, model);
};

export const starProject = async (ownerUsername: string, projectName: string): ApiResponse<void> => {
  return await api.put(`/user/starred/${ownerUsername}/${projectName}`);
};

export const unStarProject = async (ownerUsername: string, projectName: string): ApiResponse<void> => {
  return await api.delete(`/user/starred/${ownerUsername}/${projectName}`);
};

export const setPinnedProjects = async (projectIds: number[]): ApiResponse<number[]> => {
  return await api.put(`/user/pinned`, { projectIds });
};

export const checkProjectStarred = async (ownerUsername: string, projectName: string): ApiResponse<void> => {
  return await api.get(`/user/starred/${ownerUsername}/${projectName}`);
};

export const getStarredProjects = async (username: string): ApiResponse<Project[]> => {
  return await api.get(`/users/${username}/starred`);
};

export const getPinnedProjects = async (username: string): ApiResponse<Project[]> => {
  return await api.get(`/users/${username}/pinned`);
};