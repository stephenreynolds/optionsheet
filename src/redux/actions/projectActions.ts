import * as projectApi from "../../common/api/projects";
import {
  GET_PROJECTS_SUCCESS,
  GET_PROJECT_SUCCESS,
  CREATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_SUCCESS,
  DELETE_PROJECT_SUCCESS
} from "./actionTypes";
import { Project, ProjectCreateModel, ProjectUpdateModel } from "../../common/models/project";
import { apiCallError, beginApiCall } from "./apiStatusActions";

export const getProjects = (username: string) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi.getProjects(username)
      .then((response) => {
        const projects = response.data.map((project: Project) => {
          return {
            ...project,
            lastEdited: new Date(project.lastEdited)
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
          lastEdited: new Date(response.data.lastEdited)
        };
        dispatch({ type: GET_PROJECT_SUCCESS, payload: project });
      })
      .catch((error) => {
        dispatch(apiCallError());
        throw error.response.data;
      });
  };
};

export const createProject = (model: ProjectCreateModel) => {
  return (dispatch) => {
    dispatch(beginApiCall());
    return projectApi
      .createProject(model)
      .then((response) => {
        dispatch({ type: CREATE_PROJECT_SUCCESS });
        return response.data.projectUrl;
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
