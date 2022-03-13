import axios from "axios";
import { getAuthHeader } from "./auth";
import { TradeCreateModel, TradeUpdateModel } from "./models/trade";
import { ProjectCreateModel, ProjectUpdateModel } from "./models/project";
import { apiUrl } from "./api";

export const getProjects = async (username: string) => {
  return await axios.get(`${apiUrl}/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await axios.get(`${apiUrl}/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel) => {
  return await axios.post(`${apiUrl}/projects`, model, {
    headers: getAuthHeader()
  });
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel) => {
  return await axios.patch(`${apiUrl}/projects/${username}/${projectName}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteProject = async (username: string, projectName: string) => {
  return await axios.delete(`${apiUrl}/projects/${username}/${projectName}`, {
    headers: getAuthHeader()
  });
};

export const addTrade = async (
  username: string,
  projectName: string,
  trade: TradeCreateModel
) => {
  return await axios.post(`${apiUrl}/projects/${username}/${projectName}`, trade, {
    headers: getAuthHeader()
  });
};

export const getTrades = async (username: string, projectName: string) => {
  return await axios.get(`${apiUrl}/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string) => {
  return await axios.get(`${apiUrl}/trades/${id}`);
};

export const updateTradeById = async (id: string, model: TradeUpdateModel) => {
  return await axios.patch(`${apiUrl}/trades/${id}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteTradeById = async (id: string) => {
  return await axios.delete(`${apiUrl}/trades/${id}`, {
    headers: getAuthHeader()
  });
};