import * as projectApi from "../../common/api/projects";
import {
  GET_PROJECTS_SUCCESS,
  GET_PROJECT_SUCCESS,
  UPDATE_PROJECT_SUCCESS,
  DELETE_PROJECT_SUCCESS
} from "./actionTypes";
import { Project, ProjectUpdateModel } from "../../common/models/project";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const getProjects = (username: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi.getProjects(username)
      .then((response) => {
        const projects = response.data.map((project: Project) => {
          return {
            ...project,
            updated_on: new Date(project.updated_on)
          };
        });
        dispatch({ type: GET_PROJECTS_SUCCESS, payload: projects });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

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

export const deleteProject = (username: string, projectName: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .deleteProject(username, projectName)
      .then(() => {
        dispatch({ type: DELETE_PROJECT_SUCCESS });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};
