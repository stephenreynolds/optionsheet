import * as projectApi from "../../common/api/projects";
import {
  UPDATE_PROJECT_SUCCESS
} from "./actionTypes";
import { ProjectUpdateModel } from "../../common/models/project";
import { apiCallError, beginApiCall } from "./apiStatusActions";

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