import initialState from "./initialState";
import { GET_PROJECTS_SUCCESS } from "../actions/actionTypes";

const projectReducer = (state = initialState.projects, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS_SUCCESS:
      return { projects: payload };
    default:
      return state;
  }
};

export default projectReducer;