import { Trade } from "../../common/models/trade";
import { getProfitLoss } from "../../common/tradeUtils";

export const getTrades = (state): Trade[] => {
  return state.trades ? state.trades.trades : undefined;
};

export const getTradeTags = (state): string[] => {
  return state.trades ? state.trades.tags : undefined;
};

export const getTrade = (state): Trade => {
  return state.trades ? state.trades.trade : undefined;
};

export const getNetProfit = (state): number => {
  const trades = getTrades(state);
  if (!trades || trades.length === 0) {
    return NaN;
  }

  const closedTrades = trades.filter((trade) => trade.closeDate);
  const pl = closedTrades.map((trade) => getProfitLoss(trade));

  return Number(pl.reduce((a, b) => a + b, 0));
};