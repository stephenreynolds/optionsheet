import { ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import api from "./api";

export const getProjects = async (username: string) => {
  return await api.get(`/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await api.get(`/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel) => {
  return await api.post(`/projects`, model);
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel) => {
  return await api.patch(`/projects/${username}/${projectName}`, model);
};

export const deleteProject = async (username: string, projectName: string) => {
  return await api.delete(`/projects/${username}/${projectName}`);
};