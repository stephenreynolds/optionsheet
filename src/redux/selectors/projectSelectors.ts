import { Project } from "../../common/models/project";
import { Tag } from "../../common/models/tag";

export const getProject = (state): Project => {
  return state.projects ? state.projects.project : undefined;
};

export const getProjects = (state): Project[] => {
  return state.projects ? state.projects.projects : undefined;
};

export const getProjectTags = (state): Tag[] => {
  return state.projects ? state.projects.tags : undefined;
};