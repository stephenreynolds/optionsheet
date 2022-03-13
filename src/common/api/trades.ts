import { TradeCreateModel, TradeUpdateModel } from "../models/trade";
import axios from "axios";
import { apiUrl } from "../api";
import { getAuthHeader } from "../auth";

export const getTrades = async (username: string, projectName: string) => {
  return await axios.get(`${apiUrl}/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string) => {
  return await axios.get(`${apiUrl}/trades/${id}`);
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