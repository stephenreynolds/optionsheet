import axios from "axios";
import { ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import { apiRoot, getAuthHeader } from "./api";

export const getProjects = async (username: string) => {
  return await axios.get(`${apiRoot}/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await axios.get(`${apiRoot}/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel) => {
  return await axios.post(`${apiRoot}/projects`, model, {
    headers: getAuthHeader()
  });
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel) => {
  return await axios.patch(`${apiRoot}/projects/${username}/${projectName}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteProject = async (username: string, projectName: string) => {
  return await axios.delete(`${apiRoot}/projects/${username}/${projectName}`, {
    headers: getAuthHeader()
  });
};