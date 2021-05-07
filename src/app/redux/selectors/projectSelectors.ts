export const getProjects = (state) => {
  return state.projectReducer.projects;
};

export const getProject = (state) => {
  return state.projectReducer.project;
};