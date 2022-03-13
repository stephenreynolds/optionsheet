import { Project } from "../../common/models/project";

export const getProject = (state): Project => {
  return state.projects ? state.projects.project : undefined;
};

export const getProjects = (state): Project[] => {
  return state.projects ? state.projects.projects : undefined;
};

export const getProjectTags = (state): string[] => {
  return state.projects ? state.projects.tags : undefined;
};