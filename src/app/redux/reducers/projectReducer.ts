import initialState from "./initialState";
import {
  GET_PROJECT_SUCCESS,
  GET_PROJECTS_SUCCESS
} from "../actions/actionTypes";

const projectReducer = (
  state = { projects: initialState.projects, project: initialState.project },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS_SUCCESS:
      return { projects: payload };
    case GET_PROJECT_SUCCESS:
      return { project: payload };
    default:
      return state;
  }
};

export default projectReducer;
