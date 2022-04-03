import * as projectApi from "../../common/api/projects";
import {
  GET_PROJECT_SUCCESS,
  UPDATE_PROJECT_SUCCESS
} from "./actionTypes";
import { Project, ProjectUpdateModel } from "../../common/models/project";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const getProject = (username: string, projectName: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .getProjectByName(username, projectName)
      .then((response) => {
        const project: Project = {
          ...response.data,
          updated_on: new Date(response.data.updated_on)
        };
        dispatch({ type: GET_PROJECT_SUCCESS, payload: project });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const updateProject = (username: string, projectName: string, model: ProjectUpdateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .updateProject(username, projectName, model)
      .then(() => {
        dispatch({ type: UPDATE_PROJECT_SUCCESS, payload: model });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};