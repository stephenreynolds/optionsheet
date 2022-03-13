import { TradeCreateModel, TradeUpdateModel } from "../models/trade";
import axios from "axios";
import { apiRoot, getAuthHeader } from "./api";

export const getTrades = async (username: string, projectName: string) => {
  return await axios.get(`${apiRoot}/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string) => {
  return await axios.get(`${apiRoot}/trades/${id}`);
};

export const addTrade = async (
  username: string,
  projectName: string,
  trade: TradeCreateModel
) => {
  return await axios.post(`${apiRoot}/projects/${username}/${projectName}`, trade, {
    headers: getAuthHeader()
  });
};

export const updateTradeById = async (id: string, model: TradeUpdateModel) => {
  return await axios.patch(`${apiRoot}/trades/${id}`, model, {
    headers: getAuthHeader()
  });
};

export const deleteTradeById = async (id: string) => {
  return await axios.delete(`${apiRoot}/trades/${id}`, {
    headers: getAuthHeader()
  });
};