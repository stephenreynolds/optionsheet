import axios from "axios";
import { getAuthHeader } from "./auth";
import { TradeCreateModel, TradeUpdateModel } from "./models/trade";
import { ProjectCreateModel, ProjectUpdateModel } from "./models/project";

const url =
  process.env.NODE_ENV === "production" ? "" : "https://localhost:443";

export const getProjects = async (username: string) => {
  return await axios.get(`${url}/api/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await axios.get(`${url}/api/projects/${username}/${projectName}`);
};

export const createProject = async (model: ProjectCreateModel) => {
  return await axios.post(`${url}/api/projects`, model, {
    headers: getAuthHeader()
  });
};

export const updateProject = async (username: string, projectName: string, model: ProjectUpdateModel) => {
  return await axios.patch(`${url}/api/projects/${username}/${projectName}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteProject = async (username: string, projectName: string) => {
  return await axios.delete(`${url}/api/projects/${username}/${projectName}`, {
    headers: getAuthHeader()
  });
};

export const addTrade = async (
  username: string,
  projectName: string,
  trade: TradeCreateModel
) => {
  return await axios.post(`${url}/api/projects/${username}/${projectName}`, trade, {
    headers: getAuthHeader()
  });
};

export const getTrades = async (username: string, projectName: string) => {
  return await axios.get(`${url}/api/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string) => {
  return await axios.get(`${url}/api/trades/${id}`);
};

export const updateTradeById = async (id: string, model: TradeUpdateModel) => {
  return await axios.patch(`${url}/api/trades/${id}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteTradeById = async (id: string) => {
  return await axios.delete(`${url}/api/trades/${id}`, {
    headers: getAuthHeader()
  });
};