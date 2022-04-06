import { Project, ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import api from "./api";

export const parseProject = (data: any): Required<Project> => {
  return {
    id: parseInt(data.id),
    name: data.name,
    username: data.username,
    description: data.description ?? undefined,
    startingBalance: data.starting_balance ? parseFloat(data.starting_balance) : undefined,
    risk: data.risk ? parseFloat(data.risk) : undefined,
    createdOn: new Date(data.created_on),
    updatedOn: new Date(data.updated_on),
    tags: data.tags ?? [],
    pinned: data.pinned,
    stars: parseInt(data.stars)
  };
};

export const getProjects = async (username: string): Promise<Project[]> => {
  return api.get(`/projects/${username}`)
    .then(({ data }) => data.map((project) => parseProject(project)));
};

export const getProjectByName = async (username: string, projectName: string): Promise<Project> => {
  return api.get(`/projects/${username}/${projectName}`)
    .then(({ data }) => parseProject(data));
};

export const createProject = async (model: ProjectCreateModel): Promise<string> => {
  return api.post(`/projects`, model)
    .then(({ data }) => data.project_url);
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel): Promise<void> => {
  return api.patch(`/projects/${username}/${projectName}`, model);
};

export const deleteProject = async (username: string, projectName: string): Promise<void> => {
  return api.delete(`/projects/${username}/${projectName}`);
};