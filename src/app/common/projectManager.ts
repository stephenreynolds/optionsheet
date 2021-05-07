import axios from "axios";
import { getAuthHeader } from "./auth";
import { Trade } from "./models/trade";

const url =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";

export const getProjects = async (username: string) => {
  return await axios.get(`${url}/api/projects/${username}`);
};

export const getProjectByName = async (
  username: string,
  projectName: string
) => {
  return await axios.get(`${url}/api/projects/${username}/${projectName}`);
};

export const addTrade = async (
  username: string,
  projectName: string,
  trade: Trade
) => {
  return await axios.post(`${url}/api/projects/${username}/${projectName}`, {
    body: trade,
    headers: getAuthHeader()
  });
};
