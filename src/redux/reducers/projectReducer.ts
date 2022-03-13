import {
  GET_PROJECTS_SUCCESS,
  GET_PROJECT_SUCCESS,
  UPDATE_PROJECT_SUCCESS,
  DELETE_PROJECT_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL
} from "../actions/actionTypes";
import { Project, ProjectSummaryModel } from "../../common/models/project";
import _ from "lodash";
import produce from "immer";
import { Tag } from "../../common/models/tag";

interface ProjectReducerState {
  projects: ProjectSummaryModel[];
  project: Project;
  tags: Tag[];
}

const initialState: Readonly<Partial<ProjectReducerState>> = {};

const getAllProjectTags = (projects: Project[]) => {
  return _.uniq(projects
    .map((project) => project.tags)
    .flat());
};

const projectReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS_SUCCESS:
      state.projects = payload;
      state.tags = getAllProjectTags(payload);
      break;
    case GET_PROJECT_SUCCESS:
      state.project = payload;
      break;
    case UPDATE_PROJECT_SUCCESS:
      state.project = { ...state.project, ...payload };
      break;
    case DELETE_PROJECT_SUCCESS:
      delete state.project;
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      state = { };
  }

  return state;
}, initialState);

export default projectReducer;