import * as projectManager from "../../common/projectManager";
import { GET_PROJECT_SUCCESS, GET_PROJECTS_SUCCESS } from "./actionTypes";

export const getProjects = (username: string) => {
  return (dispatch) => {
    return projectManager.getProjects(username).then((response) => {
      dispatch({ type: GET_PROJECTS_SUCCESS, payload: response.data });
      return Promise.resolve();
    });
  };
};

export const getProjectByName = (username: string, projectName: string) => {
  return (dispatch) => {
    return projectManager
      .getProjectByName(username, projectName)
      .then((response) => {
        dispatch({ type: GET_PROJECT_SUCCESS, payload: response.data });
        return Promise.resolve();
      });
  };
};
