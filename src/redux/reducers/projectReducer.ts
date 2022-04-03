import {
  UPDATE_PROJECT_SUCCESS,
  LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL
} from "../actions/actionTypes";
import { Project, ProjectSummaryModel } from "../../common/models/project";
import produce from "immer";

interface ProjectReducerState {
  projects: ProjectSummaryModel[];
  project: Project;
  tags: string[];
}

const initialState: Readonly<Partial<ProjectReducerState>> = {};

const projectReducer = produce((state, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PROJECT_SUCCESS:
      state.project = { ...state.project, ...payload };
      break;
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      state = { };
      break;
  }

  return state;
}, initialState);

export default projectReducer;