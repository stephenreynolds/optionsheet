import { Project, ProjectCreateModel, ProjectUpdateModel } from "../models/project";
import api from "./api";

export const getProjects = async (username: string): Promise<Project[]> => {
  return api.get(`/projects/${username}`)
    .then(({ data }) => {
      return data.map((project) => {
        return {
          id: parseInt(project.id),
          name: project.name,
          username: project.username,
          description: project.description ?? undefined,
          startingBalance: project.starting_balance ? parseFloat(project.starting_balance) : undefined,
          risk: project.risk ? parseFloat(project.risk) : undefined,
          createdOn: new Date(project.created_on),
          updatedOn: new Date(project.updated_on),
          tags: project.tags ?? [],
          pinned: project.pinned,
          stars: parseInt(project.stars)
        } as Project;
      });
    });
};

export const getProjectByName = async (username: string, projectName: string): Promise<Project> => {
  return api.get(`/projects/${username}/${projectName}`)
    .then(({ data }) => {
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
        stars: parseInt(data.stars)
      } as Project;
    });
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