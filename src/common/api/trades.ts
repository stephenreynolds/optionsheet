import { Leg, PutCall, Side, Trade, TradeCreateModel, TradeUpdateModel } from "../models/trade";
import api from "./api";

export const getTrades = async (username: string, projectName: string): Promise<Trade[]> => {
  return api.get(`/projects/${username}/${projectName}/trades`)
    .then(({ data }) => {
      return data.map((trade) => {
        return {
          id: parseInt(trade.id),
          symbol: trade.symbol,
          openDate: new Date(trade.open_date),
          closeDate: trade.close_date ? new Date(trade.close_date) : undefined,
          openingNote: trade.opening_note ?? undefined,
          closingNote: trade.closing_note ?? undefined,
          legs: trade.legs.map((leg) => {
            return {
              side: Side[leg.side],
              quantity: parseFloat(leg.quantity),
              openPrice: parseFloat(leg.open_price),
              closePrice: leg.close_price ? parseFloat(leg.close_price) : undefined,
              strike: leg.strike ? parseFloat(leg.strike) : undefined,
              expiration: leg.expiration ? new Date(leg.expiration) : undefined,
              putCall: leg.put_call ? PutCall[leg.put_call] : undefined
            } as Leg;
          }),
          tags: trade.tags ?? [],
          createdOn: new Date(trade.created_on),
          updatedOn: new Date(trade.updated_on),
          projectId: trade.project_id
        } as Trade;
      });
    });
};

export const getTradeById = async (id: string): Promise<Trade> => {
  return api.get(`/trades/${id}`)
    .then(({ data }) => {
      return {
        id: parseInt(data.id),
        symbol: data.symbol,
        openDate: new Date(data.open_date),
        closeDate: data.close_date ? new Date(data.close_date) : undefined,
        openingNote: data.opening_note ?? undefined,
        closingNote: data.closing_note ?? undefined,
        legs: data.legs.map((leg) => {
          return {
            side: Side[leg.side],
            quantity: parseFloat(leg.quantity),
            openPrice: parseFloat(leg.open_price),
            closePrice: leg.close_price ? parseFloat(leg.close_price) : undefined,
            strike: leg.strike ? parseFloat(leg.strike) : undefined,
            expiration: leg.expiration ? new Date(leg.expiration) : undefined,
            putCall: leg.put_call ? PutCall[leg.put_call] : undefined
          } as Leg;
        }),
        tags: data.tags ?? [],
        createdOn: new Date(data.created_on),
        updatedOn: new Date(data.updated_on),
        projectId: data.project_id
      } as Trade;
    });
};

export const addTrade = async (username: string, projectName: string, trade: TradeCreateModel): Promise<void> => {
  return api.post(`/projects/${username}/${projectName}`, trade);
};

export const updateTradeById = async (id: number, model: TradeUpdateModel): Promise<void> => {
  return api.patch(`/trades/${id}`, model);
};

export const deleteTradeById = async (id: number): Promise<void> => {
  return api.delete(`/trades/${id}`);
};