import { Trade, TradeCreateModel, TradeUpdateModel } from "../models/trade";
import api, { ApiResponse } from "./api";

export const getTrades = async (username: string, projectName: string): ApiResponse<Trade[]> => {
  return await api.get(`/projects/${username}/${projectName}/trades`);
};

export const getTradeById = async (id: string): ApiResponse<Trade> => {
  return await api.get(`/trades/${id}`);
};

export const addTrade = async (username: string, projectName: string, trade: TradeCreateModel): ApiResponse<void> => {
  return await api.post(`/projects/${username}/${projectName}`, trade);
};

export const updateTradeById = async (id: string, model: TradeUpdateModel): ApiResponse<void> => {
  return await api.patch(`/trades/${id}`, model);
};

export const deleteTradeById = async (id: string): ApiResponse<void> => {
  return await api.delete(`/trades/${id}`);
};