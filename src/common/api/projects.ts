import axios from "axios";
import { ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import { apiUrl, getAuthHeader } from "./api";

export const getProjects = async (username: string) => {
  return await axios.get(`${apiUrl}/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await axios.get(`${apiUrl}/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel) => {
  return await axios.post(`${apiUrl}/projects`, model, {
    headers: getAuthHeader()
  });
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel) => {
  return await axios.patch(`${apiUrl}/projects/${username}/${projectName}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteProject = async (username: string, projectName: string) => {
  return await axios.delete(`${apiUrl}/projects/${username}/${projectName}`, {
    headers: getAuthHeader()
  });
};