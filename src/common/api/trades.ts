import { TradeCreateModel, TradeUpdateModel } from "../models/trade";
import api from "./api";

export const getTrades = async (username: string, projectName: string) => {
  return await api.get(`/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string) => {
  return await api.get(`/trades/${id}`);
};

export const addTrade = async (
  username: string,
  projectName: string,
  trade: TradeCreateModel
) => {
  return await api.post(`/projects/${username}/${projectName}`, trade);
};

export const updateTradeById = async (id: string, model: TradeUpdateModel) => {
  return await api.patch(`/trades/${id}`, model);
};

export const deleteTradeById = async (id: string) => {
  return await api.delete(`/trades/${id}`);
};