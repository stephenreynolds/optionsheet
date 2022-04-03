import { Project, ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import api, { ApiResponse } from "./api";

export const getProjects = async (username: string): ApiResponse<Project[]> => {
  return await api.get(`/projects/${username}`);
};

export const getProjectByName = async (username: string, projectName: string): ApiResponse<Project> => {
  return await api.get(`/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel): ApiResponse<{ project_url: string }> => {
  return await api.post(`/projects`, model);
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel): ApiResponse<void> => {
  return await api.patch(`/projects/${username}/${projectName}`, model);
};

export const deleteProject = async (username: string, projectName: string): ApiResponse<void> => {
  return await api.delete(`/projects/${username}/${projectName}`);
};