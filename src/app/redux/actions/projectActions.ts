import * as projectManager from "../../common/projectManager";
import { GET_PROJECTS_SUCCESS } from "./actionTypes";

export const projects = (userId: number) => {
  return (dispatch) => {
    return projectManager.getProjects(userId).then((response) => {
      dispatch({ type: GET_PROJECTS_SUCCESS, payload: response.data });
      return Promise.resolve();
    });
  };
};
